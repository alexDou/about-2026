"""`GET /api/contact/challenge` and `POST /api/contact`. Nothing is stored (ADR 0005): the request
is checked, then emailed."""

import logging

from pydantic import ValidationError

from app.contact.mailer import MailerError
from app.contact.models import ContactRequest, ContactStatus, honeypot_filled
from app.dependencies import Dependencies
from app.http import ApiRequest, ApiResponse, error_response, json_response

logger = logging.getLogger(__name__)


async def get_challenge(_request: ApiRequest, dependencies: Dependencies) -> ApiResponse:
    # One challenge per request: it must never be served twice from a cache.
    return json_response(
        dependencies.human_check.create_challenge(), headers={"cache-control": "no-store"}
    )


async def submit_contact(request: ApiRequest, dependencies: Dependencies) -> ApiResponse:
    """The order: honeypot, field validation, rate limit, human check, mail."""
    if honeypot_filled(request.body):
        # A bot is told it succeeded, so it does not adapt. Nothing is sent.
        return ApiResponse(status=ContactStatus.SENT)
    try:
        contact = ContactRequest.model_validate_json(request.body)
    except ValidationError:
        # Not logged: the fields are the Visitor's.
        return error_response(ContactStatus.INVALID_FIELDS, "Invalid fields")
    # The rate limit (Unit 4.7) goes here, between the fields and the human check.
    if not dependencies.human_check.verify(contact.altcha):
        logger.warning("Contact human check failed")
        return error_response(ContactStatus.FAILED_HUMAN_CHECK, "Human check failed")
    try:
        await dependencies.mailer.send(contact, dependencies.clock())
    except MailerError:
        logger.warning("Contact email not sent")
        return error_response(ContactStatus.EMAIL_NOT_SENT, "Email not sent")
    return ApiResponse(status=ContactStatus.SENT)
