"""The Contact contract (Unit 4.0): what `POST /api/contact` takes, what
`GET /api/contact/challenge` returns, and the status codes. It mirrors the frontend's zod schema
(`frontend/src/services/api/contact-schema.ts`) field for field and rule for rule.

`POST /api/contact` answers:
  204 sent (and a filled honeypot, silently), 422 invalid fields, 400 failed human check,
  429 limit reached, 502 email not sent. Errors carry `{"detail": ...}`.
"""

import re
from enum import IntEnum
from types import MappingProxyType
from typing import Annotated, Final

from pydantic import BaseModel, BeforeValidator, ConfigDict, Field
from pydantic.alias_generators import to_camel
from pydantic_core import PydanticCustomError


class ContactStatus(IntEnum):
    SENT = 204
    INVALID_FIELDS = 422
    FAILED_HUMAN_CHECK = 400
    LIMIT_REACHED = 429
    EMAIL_NOT_SENT = 502


# The most characters each field may hold, in code points (as zod counts and `len()` does).
CONTACT_LIMITS: Final = MappingProxyType(
    {"name": 80, "company": 100, "position": 120, "contact": 200}
)

# Line breaks and tabs become a space, so every value is one line and words stay apart; then the
# rest of Unicode category Cc goes (`\p{Cc}` in the browser).
_LINE_BREAKS = re.compile(r"\r\n|[\t\n\x0b\x0c\r\x85\u2028\u2029]")
_CONTROL_CHARACTERS = re.compile(r"[\x00-\x1f\x7f-\x9f]")
_TRIMMED = "".join(
    map(
        chr,
        [0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x20, 0xA0, 0x1680, *range(0x2000, 0x200B)]
        + [0x2028, 0x2029, 0x202F, 0x205F, 0x3000, 0xFEFF],
    )
)


def _clean(value: object) -> object:
    """Line breaks to spaces, control characters out, then trimmed. Non-strings pass through for
    the type check."""
    if not isinstance(value, str):
        return value
    return _CONTROL_CHARACTERS.sub("", _LINE_BREAKS.sub(" ", value)).strip(_TRIMMED)


def _clean_optional(value: object) -> object:
    """As `_clean`, and an empty result counts as not given. An explicit null is refused, as zod's
    `.optional()` refuses it: an optional field is left out, never sent as null."""
    if value is None:
        raise PydanticCustomError("string_type", "Input should be a valid string")
    cleaned = _clean(value)
    return None if cleaned == "" else cleaned


class ContactRequest(BaseModel):
    """`POST /api/contact`. `altcha` is the widget's solved payload; `website` is the honeypot.

    `Field` sits before `BeforeValidator`, so the core string check holds the limits on the
    cleaned value and reports `string_too_short` / `string_too_long`.
    """

    name: Annotated[
        str, Field(min_length=1, max_length=CONTACT_LIMITS["name"]), BeforeValidator(_clean)
    ]
    company: Annotated[
        str, Field(min_length=1, max_length=CONTACT_LIMITS["company"]), BeforeValidator(_clean)
    ]
    position: Annotated[
        str | None, Field(max_length=CONTACT_LIMITS["position"]), BeforeValidator(_clean_optional)
    ] = None
    contact: Annotated[
        str | None, Field(max_length=CONTACT_LIMITS["contact"]), BeforeValidator(_clean_optional)
    ] = None
    altcha: Annotated[str, Field(min_length=1), BeforeValidator(_clean)]
    website: Annotated[str | None, BeforeValidator(_clean_optional)] = None


class ChallengeParameters(BaseModel):
    """The parameters of an ALTCHA v2 challenge, in the library's camelCase JSON."""

    model_config = ConfigDict(alias_generator=to_camel, validate_by_name=True)

    algorithm: str
    cost: int
    key_length: int
    key_prefix: str
    nonce: str
    salt: str
    expires_at: int
    key_signature: str | None = None


class ChallengeResponse(BaseModel):
    """`GET /api/contact/challenge`: an ALTCHA v2 challenge signed with `ALTCHA_HMAC_KEY`."""

    parameters: ChallengeParameters
    signature: str
