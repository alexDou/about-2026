"""What the handlers need from outside, handed over by the entry module (or a test) as plain
values. Nothing here imports the Workers runtime."""

from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime
from typing import Protocol

from app.contact.models import ChallengeResponse, ContactRequest


class ContactMailer(Protocol):
    """Emails a Contact request to the Owner. Raises `MailerError` when it cannot."""

    async def send(self, request: ContactRequest, sent_at: datetime) -> None: ...


class HumanCheck(Protocol):
    """Tells Visitors from bots with a proof of work the browser solves."""

    def create_challenge(self) -> ChallengeResponse: ...

    def verify(self, payload: str) -> bool:
        """Whether `payload` is a solved, signed, unexpired challenge. Never raises."""
        ...


@dataclass(frozen=True)
class Dependencies:
    mailer: ContactMailer
    human_check: HumanCheck
    # The current time, timezone-aware.
    clock: Callable[[], datetime]
