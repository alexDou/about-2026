"""Contract test: the Contact models accept and reject along the rules the frontend's zod schema
holds (`frontend/src/services/api/contact-schema.ts`)."""

import json

import pytest
from pydantic import ValidationError

from app.contact.models import (
    CONTACT_LIMITS,
    ChallengeParameters,
    ChallengeResponse,
    ContactRequest,
    ContactStatus,
)
from app.http import json_response

VALID = {
    "name": "Ada Lovelace",
    "company": "Analytical Engines",
    "altcha": "eyJwYXlsb2FkIjp0cnVlfQ==",
}


def parse(**fields: object) -> ContactRequest:
    return ContactRequest.model_validate({**VALID, **fields})


def error_types(**fields: object) -> dict[str, str]:
    with pytest.raises(ValidationError) as caught:
        parse(**fields)
    return {".".join(map(str, e["loc"])): e["type"] for e in caught.value.errors()}


def test_accepts_name_company_and_altcha_only() -> None:
    request = parse()
    assert request.model_dump() == {
        "name": "Ada Lovelace",
        "company": "Analytical Engines",
        "position": None,
        "contact": None,
        "altcha": VALID["altcha"],
        "website": None,
    }


def test_accepts_every_field() -> None:
    request = parse(position="Staff engineer", contact="ada@example.com", website="")
    assert request.position == "Staff engineer"
    assert request.contact == "ada@example.com"


def test_limits_match_the_contract() -> None:
    assert CONTACT_LIMITS == {"name": 80, "company": 100, "position": 120, "contact": 200}


@pytest.mark.parametrize(("field", "limit"), CONTACT_LIMITS.items())
def test_accepts_a_value_at_its_limit(field: str, limit: int) -> None:
    assert getattr(parse(**{field: "x" * limit}), field) == "x" * limit


@pytest.mark.parametrize(("field", "limit"), CONTACT_LIMITS.items())
def test_rejects_a_value_over_its_limit(field: str, limit: int) -> None:
    assert error_types(**{field: "x" * (limit + 1)}) == {field: "string_too_long"}


def test_counts_length_in_code_points_as_zod_does() -> None:
    # U+1F600 (an emoji) is one code point, though two UTF-16 code units.
    assert parse(name="\U0001f600" * 80).name == "\U0001f600" * 80
    assert error_types(name="\U0001f600" * 81) == {"name": "string_too_long"}


@pytest.mark.parametrize("field", ["name", "company", "altcha"])
def test_rejects_a_missing_required_field(field: str) -> None:
    body = {key: value for key, value in VALID.items() if key != field}
    with pytest.raises(ValidationError) as caught:
        ContactRequest.model_validate(body)
    assert [e["loc"] for e in caught.value.errors()] == [(field,)]


@pytest.mark.parametrize("field", ["name", "company", "altcha"])
@pytest.mark.parametrize("blank", ["", "   ", "\t\n", "\u00a0\u3000\ufeff", "\x00\x07"])
def test_whitespace_only_counts_as_empty_for_a_required_field(field: str, blank: str) -> None:
    assert error_types(**{field: blank}) == {field: "string_too_short"}


@pytest.mark.parametrize("field", ["position", "contact", "website"])
@pytest.mark.parametrize("blank", ["", "   ", "\u00a0\ufeff", "\x1b"])
def test_whitespace_only_counts_as_empty_for_an_optional_field(field: str, blank: str) -> None:
    assert getattr(parse(**{field: blank}), field) is None


def test_trims_and_strips_control_characters() -> None:
    request = parse(name="  Ada\x00 Love\x7flace\u0085 ", company="\ufeffEngines\u00a0")
    assert request.name == "Ada Lovelace"
    assert request.company == "Engines"


@pytest.mark.parametrize("separator", ["\n", "\r\n", "\r", "\t", "\u2028", "\u2029", "\x85"])
def test_line_breaks_and_tabs_become_a_space(separator: str) -> None:
    assert parse(position=f"Staff{separator}engineer{separator}").position == "Staff engineer"


def test_limits_apply_after_cleaning() -> None:
    assert parse(name=" " * 10 + "x" * 80 + "\x00" * 10).name == "x" * 80


@pytest.mark.parametrize("field", ["position", "contact", "website"])
def test_rejects_an_explicit_null_for_an_optional_field(field: str) -> None:
    assert error_types(**{field: None}) == {field: "string_type"}


@pytest.mark.parametrize("value", [42, None, ["Ada"], {"first": "Ada"}])
def test_rejects_a_value_that_is_not_a_string(value: object) -> None:
    assert error_types(name=value) == {"name": "string_type"}


def test_ignores_unknown_fields() -> None:
    assert "role" not in parse(role="admin").model_dump()


def test_status_codes_match_the_contract() -> None:
    assert {status.name: status.value for status in ContactStatus} == {
        "SENT": 204,
        "INVALID_FIELDS": 422,
        "FAILED_HUMAN_CHECK": 400,
        "LIMIT_REACHED": 429,
        "EMAIL_NOT_SENT": 502,
    }


CHALLENGE_JSON = {
    "parameters": {
        "algorithm": "PBKDF2/SHA-256",
        "cost": 5000,
        "keyLength": 32,
        "keyPrefix": "00",
        "nonce": "359789ddd71a7f311103bab530dfe498",
        "salt": "efa12180eee8848e8cd0af47bf12c4b0",
        "expiresAt": 1795179859,
    },
    "signature": "c6ab2614258fd40c2b41339078d1742fc641f91c581e63f2ed2dabf2f1bf7a1e",
}


def test_challenge_serializes_to_the_altcha_v2_json() -> None:
    challenge = ChallengeResponse.model_validate(CHALLENGE_JSON)
    response = json_response(challenge)
    assert json.loads(response.body) == CHALLENGE_JSON


def test_challenge_carries_the_key_signature_when_there_is_one() -> None:
    parameters = {**CHALLENGE_JSON["parameters"], "keySignature": "ab12"}
    challenge = ChallengeResponse.model_validate({**CHALLENGE_JSON, "parameters": parameters})
    assert json.loads(json_response(challenge).body)["parameters"]["keySignature"] == "ab12"


@pytest.mark.parametrize(
    "field", ["algorithm", "cost", "keyLength", "keyPrefix", "nonce", "salt", "expiresAt"]
)
def test_challenge_parameters_require_every_contract_field(field: str) -> None:
    parameters = {k: v for k, v in CHALLENGE_JSON["parameters"].items() if k != field}
    with pytest.raises(ValidationError):
        ChallengeParameters.model_validate(parameters)
