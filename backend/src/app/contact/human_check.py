"""The human check: an ALTCHA v2 proof of work, self-hosted (no third party, no cookies).

The backend hands out a challenge signed with `ALTCHA_HMAC_KEY`; the widget in the form solves it
in the browser and sends the payload with the Contact request, and the backend verifies it.
"""

from collections.abc import Callable
from datetime import datetime, timedelta

import altcha

from app.contact.models import ChallengeResponse

ALGORITHM = "PBKDF2/SHA-256"
# Iterations of the key derivation: what verifying one payload costs the Worker, and about
# 256 times that what solving one costs the browser. Unit 8 tunes it against the CPU budget.
COST = 2000
# A challenge is fetched when the form is submitted, so a short life is enough.
CHALLENGE_LIFETIME = timedelta(minutes=5)


class AltchaHumanCheck:
    """The `HumanCheck` the Worker uses, wrapping the `altcha` library."""

    def __init__(self, hmac_key: str, clock: Callable[[], datetime]):
        self._hmac_key = hmac_key
        self._clock = clock

    def _key(self) -> str:
        # Checked where it is used, not when built: the entry builds this for every request, and
        # a missing secret must not take `/api/health` down with the Contact routes.
        if not self._hmac_key:
            raise ValueError("ALTCHA_HMAC_KEY is not set")
        return self._hmac_key

    def create_challenge(self) -> ChallengeResponse:
        challenge = altcha.create_challenge(
            ALGORITHM,
            COST,
            expires_at=self._clock() + CHALLENGE_LIFETIME,
            hmac_secret=self._key(),
        )
        return ChallengeResponse.model_validate(challenge.to_dict())

    def verify(self, payload: str) -> bool:
        """Whether `payload` is a challenge signed by us, unexpired and solved."""
        return altcha.verify_solution(payload, self._key()).verified
