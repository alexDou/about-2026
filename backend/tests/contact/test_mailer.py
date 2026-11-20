"""Mailer tests: the `send_email` binding is mocked along its contract (Cloudflare Email Service):
`await binding.send({"from", "to", "subject", "text", "replyTo"?})`."""

import asyncio
from datetime import UTC, datetime
from unittest.mock import AsyncMock

import pytest

from app.contact.mailer import MailerError, build_message, send_contact_request
from app.contact.models import ContactRequest

SENT_AT = datetime(2026, 11, 20, 13, 5, tzinfo=UTC)  # 14:05 in Berlin (CET)
SUMMER = datetime(2026, 7, 1, 13, 5, tzinfo=UTC)  # 15:05 in Berlin (CEST)


def contact(**fields: object) -> ContactRequest:
    return ContactRequest.model_validate(
        {"name": "Ada Lovelace", "company": "Analytical Engines", "altcha": "x", **fields}
    )


def message(request: ContactRequest, sent_at: datetime = SENT_AT) -> dict[str, str]:
    return build_message(request, "site@owner.test", "owner@mail.test", sent_at)


def test_addresses_it_from_the_site_to_the_owner() -> None:
    built = message(contact())
    assert built["from"] == "site@owner.test"
    assert built["to"] == "owner@mail.test"


def test_subject_names_the_visitor_and_the_company() -> None:
    assert message(contact())["subject"] == "Contact request: Ada Lovelace, Analytical Engines"


def test_subject_never_carries_a_line_break() -> None:
    # A model that skipped the cleaning must still not inject a header.
    request = ContactRequest.model_construct(
        name="Ada\r\nBcc: evil@x.test", company="Co\nX", position=None, contact=None, altcha="x"
    )
    subject = message(request)["subject"]
    assert "\r" not in subject
    assert "\n" not in subject


def test_body_lists_each_field_and_the_time_in_berlin() -> None:
    body = message(contact(position="Staff engineer", contact="ada@example.com"))["text"]
    assert body.splitlines() == [
        "Name: Ada Lovelace",
        "Company: Analytical Engines",
        "Position: Staff engineer",
        "Contact: ada@example.com",
        "Sent: 2026-11-20 14:05 (Europe/Berlin)",
    ]


def test_body_says_so_for_a_field_not_given() -> None:
    lines = message(contact())["text"].splitlines()
    assert "Position: (not given)" in lines
    assert "Contact: (not given)" in lines


def test_berlin_time_follows_daylight_saving() -> None:
    assert "Sent: 2026-07-01 15:05 (Europe/Berlin)" in message(contact(), SUMMER)["text"]


def test_reply_to_is_the_contact_when_it_is_an_email_address() -> None:
    assert message(contact(contact="ada@example.com"))["replyTo"] == "ada@example.com"


@pytest.mark.parametrize(
    "given",
    [None, "+49 170 1234567", "linkedin.com/in/ada", "Ada <ada@example.com>", "a@b, c@d.test"],
)
def test_no_reply_to_when_the_contact_is_not_an_email_address(given: str | None) -> None:
    fields = {} if given is None else {"contact": given}
    assert "replyTo" not in message(contact(**fields))


def test_hands_the_message_to_the_binding_once() -> None:
    binding = AsyncMock()
    request = contact()
    asyncio.run(
        send_contact_request(binding, "site@owner.test", "owner@mail.test", request, SENT_AT)
    )
    binding.send.assert_awaited_once_with(message(request))


def test_a_failing_binding_is_a_mailer_error() -> None:
    binding = AsyncMock()
    binding.send.side_effect = RuntimeError("E_SENDER_NOT_VERIFIED: secret details")
    with pytest.raises(MailerError) as caught:
        asyncio.run(
            send_contact_request(binding, "site@owner.test", "owner@mail.test", contact(), SENT_AT)
        )
    assert "secret details" not in str(caught.value)
