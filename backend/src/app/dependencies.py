"""What the handlers need from outside, handed over by the entry module (or a test) as plain
values. Nothing here imports the Workers runtime."""

from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime
from typing import Protocol

from app.contact.models import ContactRequest


class ContactMailer(Protocol):
    """Emails a Contact request to the Owner. Raises `MailerError` when it cannot."""

    async def send(self, request: ContactRequest, sent_at: datetime) -> None: ...


@dataclass(frozen=True)
class Dependencies:
    mailer: ContactMailer
    # The current time, timezone-aware.
    clock: Callable[[], datetime]
