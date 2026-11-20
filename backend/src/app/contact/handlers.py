"""`POST /api/contact`. Nothing is stored (ADR 0005): the request is checked, then emailed."""

import logging

from pydantic import ValidationError

from app.contact.mailer import MailerError
from app.contact.models import ContactRequest, ContactStatus
from app.dependencies import Dependencies
from app.http import ApiRequest, ApiResponse, error_response

logger = logging.getLogger(__name__)


async def submit_contact(request: ApiRequest, dependencies: Dependencies) -> ApiResponse:
    try:
        contact = ContactRequest.model_validate_json(request.body)
    except ValidationError:
        # Not logged: the fields are the Visitor's.
        return error_response(ContactStatus.INVALID_FIELDS, "Invalid fields")
    try:
        await dependencies.mailer.send(contact, dependencies.clock())
    except MailerError:
        logger.warning("Contact email not sent")
        return error_response(ContactStatus.EMAIL_NOT_SENT, "Email not sent")
    return ApiResponse(status=ContactStatus.SENT)
