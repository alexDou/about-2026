"""`GET /api/contact/challenge` and `POST /api/contact`. Nothing is stored (ADR 0005): the request
is checked, then emailed."""

import logging

from pydantic import ValidationError

from app.contact.mailer import MailerError
from app.contact.models import (
    ContactRequest,
    ContactStatus,
    InvalidFieldsResponse,
    field_errors,
    probe_body,
)
from app.dependencies import Dependencies
from app.http import ApiRequest, ApiResponse, error_response, json_response

logger = logging.getLogger(__name__)


async def get_challenge(_request: ApiRequest, dependencies: Dependencies) -> ApiResponse:
    # One challenge per request: it must never be served twice from a cache.
    return json_response(
        dependencies.human_check.create_challenge(), headers={"cache-control": "no-store"}
    )


async def submit_contact(request: ApiRequest, dependencies: Dependencies) -> ApiResponse:
    """The order: honeypot, human check, field validation, mail. (Unit 8 adds the rate limit
    before the human check.) The human check comes before the fields so that a bot learns nothing
    about the field rules."""
    probe = probe_body(request.body)
    if probe.honeypot_filled:
        # A bot is told it succeeded, so it does not adapt. Nothing is sent.
        return ApiResponse(status=ContactStatus.SENT)
    if probe.altcha is None or not dependencies.human_check.verify(probe.altcha):
        logger.warning("Contact human check failed")
        return error_response(ContactStatus.FAILED_HUMAN_CHECK, "Human check failed")
    try:
        contact = ContactRequest.model_validate_json(request.body)
    except ValidationError as invalid:
        # Not logged: the fields are the Visitor's. Only which field and what rule go back.
        fields = field_errors(invalid.errors(include_input=False))
        return json_response(
            InvalidFieldsResponse(detail="Invalid fields", fields=fields),
            ContactStatus.INVALID_FIELDS,
        )
    try:
        await dependencies.mailer.send(contact, dependencies.clock())
    except MailerError:
        logger.warning("Contact email not sent")
        return error_response(ContactStatus.EMAIL_NOT_SENT, "Email not sent")
    return ApiResponse(status=ContactStatus.SENT)
