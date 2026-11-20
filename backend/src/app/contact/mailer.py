"""The Contact request email, sent through the Worker's `send_email` binding (Cloudflare Email
Service, ADR 0006). Nothing is stored (ADR 0005)."""

import re
from dataclasses import dataclass
from datetime import datetime
from typing import Protocol
from zoneinfo import ZoneInfo

from app.contact.models import ContactRequest

OWNER_TIME_ZONE = ZoneInfo("Europe/Berlin")
NOT_GIVEN = "(not given)"

_LINE_BREAKS = re.compile(r"[\r\n]+")
# One bare address: no display name, no list.
_EMAIL_ADDRESS = re.compile(r"[^@\s<>,;\"()]+@[^@\s<>,;\"()]+\.[^@\s<>,;\"()]+")


class EmailBinding(Protocol):
    """The `send_email` binding: `send({"from", "to", "subject", "text", "replyTo"?})`."""

    async def send(self, message: dict[str, str]) -> object: ...


class MailerError(Exception):
    """The email could not be sent. The message is safe to log: it carries no Visitor data."""


def _header(value: str) -> str:
    """One line, so a value can never open another header."""
    return _LINE_BREAKS.sub(" ", value)


def build_message(
    request: ContactRequest, sender: str, recipient: str, sent_at: datetime
) -> dict[str, str]:
    local_time = sent_at.astimezone(OWNER_TIME_ZONE)
    body = [
        f"Name: {request.name}",
        f"Company: {request.company}",
        f"Position: {request.position or NOT_GIVEN}",
        f"Contact: {request.contact or NOT_GIVEN}",
        f"Sent: {local_time:%Y-%m-%d %H:%M} (Europe/Berlin)",
    ]
    message = {
        "from": _header(sender),
        "to": _header(recipient),
        "subject": _header(f"Contact request: {request.name}, {request.company}"),
        "text": "\n".join(body),
    }
    if request.contact and _EMAIL_ADDRESS.fullmatch(request.contact):
        message["replyTo"] = _header(request.contact)
    return message


async def send_contact_request(
    binding: EmailBinding,
    sender: str,
    recipient: str,
    request: ContactRequest,
    sent_at: datetime,
) -> None:
    try:
        await binding.send(build_message(request, sender, recipient, sent_at))
    except Exception as error:
        # The binding's error may echo the message; keep it out of ours.
        raise MailerError("Email not sent") from error


@dataclass(frozen=True)
class EmailMailer:
    """The `ContactMailer` the Worker uses: the binding plus `MAIL_FROM` and `MAIL_TO`."""

    binding: EmailBinding
    sender: str
    recipient: str

    async def send(self, request: ContactRequest, sent_at: datetime) -> None:
        await send_contact_request(self.binding, self.sender, self.recipient, request, sent_at)
