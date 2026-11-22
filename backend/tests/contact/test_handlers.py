"""`POST /api/contact` through the route table, with the mailer and the clock mocked along their
contracts."""

import asyncio
import json
from datetime import UTC, datetime
from unittest.mock import AsyncMock, Mock

import pytest

from app.contact.mailer import MailerError
from app.contact.models import ChallengeParameters, ChallengeResponse, ContactRequest
from app.dependencies import Dependencies
from app.http import ApiRequest, ApiResponse
from app.routes import dispatch

NOW = datetime(2026, 11, 20, 13, 5, tzinfo=UTC)
VALID = {"name": "Ada Lovelace", "company": "Analytical Engines", "altcha": "payload"}


CHALLENGE = ChallengeResponse(
    parameters=ChallengeParameters(
        algorithm="PBKDF2/SHA-256",
        cost=1000,
        keyLength=32,
        keyPrefix="00",
        nonce="a" * 32,
        salt="b" * 32,
        expiresAt=1_795_000_000,
    ),
    signature="c" * 64,
)


@pytest.fixture
def mailer() -> AsyncMock:
    return AsyncMock()


@pytest.fixture
def human_check() -> Mock:
    """A human check that passes every payload and hands out one fixed challenge."""
    mock = Mock()
    mock.verify.return_value = True
    mock.create_challenge.return_value = CHALLENGE
    return mock


def post(mailer: AsyncMock, body: object, human_check: Mock | None = None) -> ApiResponse:
    deps = Dependencies(
        mailer=mailer, human_check=human_check or passing_human_check(), clock=lambda: NOW
    )
    raw = body if isinstance(body, bytes) else json.dumps(body).encode()
    request = ApiRequest(method="POST", path="/api/contact", body=raw)
    return asyncio.run(dispatch(request, deps))


def passing_human_check() -> Mock:
    mock = Mock()
    mock.verify.return_value = True
    return mock


def test_204_with_no_body_after_the_mailer_sent(mailer: AsyncMock) -> None:
    response = post(mailer, {**VALID, "position": "Staff engineer", "contact": "ada@example.com"})
    assert response.status == 204
    assert response.body == ""


def test_the_mailer_gets_the_cleaned_request_and_the_time(mailer: AsyncMock) -> None:
    post(mailer, {**VALID, "name": "  Ada\nLovelace  ", "position": "   "})
    mailer.send.assert_awaited_once()
    sent, sent_at = mailer.send.await_args.args
    assert isinstance(sent, ContactRequest)
    assert sent.name == "Ada Lovelace"
    assert sent.position is None
    assert sent_at == NOW


@pytest.mark.parametrize(
    ("broken", "field", "error"),
    [
        ({"name": ""}, "name", "required"),
        ({"name": "   "}, "name", "required"),
        ({"name": "x" * 81}, "name", "tooLong"),
        ({"company": ""}, "company", "required"),
        ({"company": "x" * 101}, "company", "tooLong"),
        ({"position": "x" * 121}, "position", "tooLong"),
        ({"contact": "x" * 201}, "contact", "tooLong"),
        ({"name": 7}, "name", "required"),
        ({"contact": None}, "contact", "required"),
        ({"website": 7}, "website", "required"),
    ],
)
def test_422_names_the_broken_field_and_nothing_is_sent(
    mailer: AsyncMock, broken: dict[str, object], field: str, error: str
) -> None:
    response = post(mailer, {**VALID, **broken})
    assert response.status == 422
    assert json.loads(response.body) == {
        "detail": "Invalid fields",
        "fields": [{"field": field, "error": error}],
    }
    mailer.send.assert_not_awaited()


def test_422_names_every_broken_field_once_in_the_order_of_the_form(mailer: AsyncMock) -> None:
    response = post(mailer, {**VALID, "name": "", "company": "x" * 101, "contact": "x" * 201})
    assert json.loads(response.body)["fields"] == [
        {"field": "name", "error": "required"},
        {"field": "company", "error": "tooLong"},
        {"field": "contact", "error": "tooLong"},
    ]


def test_422_when_a_required_field_is_missing(mailer: AsyncMock) -> None:
    response = post(mailer, {"company": "Co", "altcha": "x"})
    assert response.status == 422
    assert json.loads(response.body)["fields"] == [{"field": "name", "error": "required"}]


@pytest.mark.parametrize("body", [b"", b"not json", b"[]", b"null"])
def test_400_when_the_body_is_not_a_request_object(mailer: AsyncMock, body: bytes) -> None:
    """There is no payload to check, so the human check is what fails."""
    response = post(mailer, body)
    assert response.status == 400
    mailer.send.assert_not_awaited()


def test_502_when_the_mailer_cannot_send(mailer: AsyncMock) -> None:
    mailer.send.side_effect = MailerError("Email not sent")
    response = post(mailer, VALID)
    assert response.status == 502
    assert json.loads(response.body) == {"detail": "Email not sent"}


def test_other_methods_on_the_path_answer_405(mailer: AsyncMock) -> None:
    deps = Dependencies(mailer=mailer, human_check=passing_human_check(), clock=lambda: NOW)
    response = asyncio.run(dispatch(ApiRequest(method="GET", path="/api/contact"), deps))
    assert response.status == 405
    assert response.headers["allow"] == "POST"


def test_the_human_check_gets_the_widgets_payload(mailer: AsyncMock, human_check: Mock) -> None:
    post(mailer, VALID, human_check)
    human_check.verify.assert_called_once_with("payload")


def test_400_when_the_human_check_rejects_and_nothing_sent(
    mailer: AsyncMock, human_check: Mock
) -> None:
    human_check.verify.return_value = False
    response = post(mailer, VALID, human_check)
    assert response.status == 400
    assert json.loads(response.body) == {"detail": "Human check failed"}
    mailer.send.assert_not_awaited()


def test_the_human_check_is_answered_before_the_fields_are_checked(
    mailer: AsyncMock, human_check: Mock
) -> None:
    """A bot learns nothing about the field rules."""
    human_check.verify.return_value = False
    assert post(mailer, {**VALID, "name": ""}, human_check).status == 400


@pytest.mark.parametrize("altcha", [None, "", "   ", 7, "x" * 2049])
def test_400_without_a_usable_payload_and_the_human_check_is_not_asked(
    mailer: AsyncMock, human_check: Mock, altcha: object
) -> None:
    body = {key: value for key, value in VALID.items() if key != "altcha"}
    response = post(mailer, {**body, "altcha": altcha}, human_check)
    assert response.status == 400
    human_check.verify.assert_not_called()
    mailer.send.assert_not_awaited()


def test_a_filled_honeypot_gets_a_silent_204_and_nothing_is_sent(
    mailer: AsyncMock, human_check: Mock
) -> None:
    response = post(mailer, {**VALID, "website": "https://spam.example"}, human_check)
    assert response.status == 204
    assert response.body == ""
    mailer.send.assert_not_awaited()
    human_check.verify.assert_not_called()


def test_the_honeypot_is_answered_before_the_fields_are_checked(mailer: AsyncMock) -> None:
    response = post(mailer, {"name": "", "website": "x"})
    assert response.status == 204
    mailer.send.assert_not_awaited()


@pytest.mark.parametrize("website", ["", "   ", "\n"])
def test_an_empty_honeypot_is_a_normal_request(mailer: AsyncMock, website: str) -> None:
    assert post(mailer, {**VALID, "website": website}).status == 204
    mailer.send.assert_awaited_once()


def test_a_honeypot_that_is_not_text_is_not_a_silent_204(mailer: AsyncMock) -> None:
    assert post(mailer, {**VALID, "website": None}).status == 422
    assert post(mailer, {**VALID, "website": 7}).status == 422
    mailer.send.assert_not_awaited()


def test_the_honeypot_is_answered_before_the_human_check(
    mailer: AsyncMock, human_check: Mock
) -> None:
    human_check.verify.return_value = False
    assert post(mailer, {**VALID, "website": "x"}, human_check).status == 204


def challenge(human_check: Mock) -> ApiResponse:
    deps = Dependencies(mailer=AsyncMock(), human_check=human_check, clock=lambda: NOW)
    return asyncio.run(dispatch(ApiRequest(method="GET", path="/api/contact/challenge"), deps))


def test_the_challenge_is_the_human_checks_challenge_as_json(human_check: Mock) -> None:
    response = challenge(human_check)
    assert response.status == 200
    assert response.headers["content-type"] == "application/json"
    assert json.loads(response.body) == {
        "parameters": {
            "algorithm": "PBKDF2/SHA-256",
            "cost": 1000,
            "keyLength": 32,
            "keyPrefix": "00",
            "nonce": "a" * 32,
            "salt": "b" * 32,
            "expiresAt": 1_795_000_000,
        },
        "signature": "c" * 64,
    }


def test_a_challenge_is_never_cached(human_check: Mock) -> None:
    assert challenge(human_check).headers["cache-control"] == "no-store"


def test_the_challenge_path_answers_only_get(mailer: AsyncMock, human_check: Mock) -> None:
    deps = Dependencies(mailer=mailer, human_check=human_check, clock=lambda: NOW)
    request = ApiRequest(method="POST", path="/api/contact/challenge")
    response = asyncio.run(dispatch(request, deps))
    assert response.status == 405
    assert response.headers["allow"] == "GET"
