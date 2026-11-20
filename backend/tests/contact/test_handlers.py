"""`POST /api/contact` through the route table, with the mailer and the clock mocked along their
contracts."""

import asyncio
import json
from datetime import UTC, datetime
from unittest.mock import AsyncMock

import pytest

from app.contact.mailer import MailerError
from app.contact.models import ContactRequest
from app.dependencies import Dependencies
from app.http import ApiRequest, ApiResponse
from app.routes import dispatch

NOW = datetime(2026, 11, 20, 13, 5, tzinfo=UTC)
VALID = {"name": "Ada Lovelace", "company": "Analytical Engines", "altcha": "payload"}


@pytest.fixture
def mailer() -> AsyncMock:
    return AsyncMock()


def post(mailer: AsyncMock, body: object) -> ApiResponse:
    deps = Dependencies(mailer=mailer, clock=lambda: NOW)
    raw = body if isinstance(body, bytes) else json.dumps(body).encode()
    request = ApiRequest(method="POST", path="/api/contact", body=raw)
    return asyncio.run(dispatch(request, deps))


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
    "broken",
    [
        {"name": ""},
        {"name": "   "},
        {"name": "x" * 81},
        {"company": ""},
        {"company": "x" * 101},
        {"position": "x" * 121},
        {"contact": "x" * 201},
        {"name": 7},
        {"contact": None},
    ],
)
def test_422_per_broken_rule_and_nothing_sent(mailer: AsyncMock, broken: dict[str, object]) -> None:
    response = post(mailer, {**VALID, **broken})
    assert response.status == 422
    assert json.loads(response.body) == {"detail": "Invalid fields"}
    mailer.send.assert_not_awaited()


def test_422_when_a_required_field_is_missing(mailer: AsyncMock) -> None:
    assert post(mailer, {"company": "Co", "altcha": "x"}).status == 422


@pytest.mark.parametrize("body", [b"", b"not json", b"[]", b"null"])
def test_422_when_the_body_is_not_a_request_object(mailer: AsyncMock, body: bytes) -> None:
    response = post(mailer, body)
    assert response.status == 422
    mailer.send.assert_not_awaited()


def test_502_when_the_mailer_cannot_send(mailer: AsyncMock) -> None:
    mailer.send.side_effect = MailerError("Email not sent")
    response = post(mailer, VALID)
    assert response.status == 502
    assert json.loads(response.body) == {"detail": "Email not sent"}


def test_other_methods_on_the_path_answer_405(mailer: AsyncMock) -> None:
    deps = Dependencies(mailer=mailer, clock=lambda: NOW)
    response = asyncio.run(dispatch(ApiRequest(method="GET", path="/api/contact"), deps))
    assert response.status == 405
    assert response.headers["allow"] == "POST"
