"""The human check against the `altcha` library's own solver: a payload it solved passes, a
tampered, expired or malformed one does not."""

import base64
import json
from datetime import UTC, datetime, timedelta

import altcha
import pytest

from app.contact.human_check import CHALLENGE_LIFETIME, AltchaHumanCheck
from app.contact.models import ChallengeResponse

KEY = "test-hmac-key"
NOW = datetime.now(UTC)


def check(key: str = KEY, now: datetime | None = None) -> AltchaHumanCheck:
    return AltchaHumanCheck(hmac_key=key, clock=lambda: now or NOW)


def solved_payload(human_check: AltchaHumanCheck) -> dict:
    """What the widget sends back: the challenge as handed out, plus the library's solution."""
    response = human_check.create_challenge()
    challenge = altcha.Challenge.from_dict(response.model_dump(by_alias=True, exclude_none=True))
    solution = altcha.solve_challenge(challenge)
    assert solution is not None
    return altcha.Payload(challenge, solution).to_dict()


def encode(payload: object) -> str:
    return base64.b64encode(json.dumps(payload).encode()).decode()


def test_the_challenge_matches_the_contract_and_expires() -> None:
    response = check().create_challenge()
    assert isinstance(response, ChallengeResponse)
    wire = response.model_dump(by_alias=True, exclude_none=True)
    assert set(wire) == {"parameters", "signature"}
    assert set(wire["parameters"]) == {
        "algorithm",
        "cost",
        "keyLength",
        "keyPrefix",
        "nonce",
        "salt",
        "expiresAt",
    }
    assert response.parameters.expires_at == int((NOW + CHALLENGE_LIFETIME).timestamp())


def test_every_challenge_is_new() -> None:
    human_check = check()
    first, second = human_check.create_challenge(), human_check.create_challenge()
    assert first.parameters.nonce != second.parameters.nonce
    assert first.signature != second.signature


def test_a_payload_the_library_solved_passes() -> None:
    human_check = check()
    assert human_check.verify(encode(solved_payload(human_check))) is True


def test_a_payload_signed_with_another_key_fails() -> None:
    payload = encode(solved_payload(check(key="another-key")))
    assert check().verify(payload) is False


def test_a_tampered_challenge_fails() -> None:
    human_check = check()
    payload = solved_payload(human_check)
    payload["challenge"]["parameters"]["cost"] = 1
    assert human_check.verify(encode(payload)) is False


def test_a_tampered_signature_fails() -> None:
    human_check = check()
    payload = solved_payload(human_check)
    payload["challenge"]["signature"] = "0" * 64
    assert human_check.verify(encode(payload)) is False


def test_a_wrong_solution_fails() -> None:
    human_check = check()
    payload = solved_payload(human_check)
    payload["solution"]["counter"] += 1
    assert human_check.verify(encode(payload)) is False


def test_an_unsigned_challenge_fails() -> None:
    human_check = check()
    payload = solved_payload(human_check)
    del payload["challenge"]["signature"]
    assert human_check.verify(encode(payload)) is False


def test_an_expired_challenge_fails() -> None:
    issued = NOW - CHALLENGE_LIFETIME - timedelta(minutes=1)
    issuing = check(now=issued)
    assert check().verify(encode(solved_payload(issuing))) is False


@pytest.mark.parametrize(
    "payload",
    [
        "",
        "not base64!",
        base64.b64encode(b"not json").decode(),
        encode([]),
        encode("text"),
        encode({}),
        encode({"challenge": 1, "solution": 2}),
        encode({"challenge": {"parameters": []}, "solution": {}}),
    ],
)
def test_a_malformed_payload_fails(payload: str) -> None:
    assert check().verify(payload) is False


def test_a_missing_key_is_refused_where_it_is_used_not_when_built() -> None:
    human_check = check(key="")
    with pytest.raises(ValueError, match="ALTCHA_HMAC_KEY"):
        human_check.create_challenge()
    with pytest.raises(ValueError, match="ALTCHA_HMAC_KEY"):
        human_check.verify("payload")
