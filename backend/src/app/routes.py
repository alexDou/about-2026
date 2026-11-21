"""The route table: every `/api` endpoint, matched on method and exact path."""

from collections.abc import Awaitable, Callable

from app.contact.handlers import get_challenge, submit_contact
from app.dependencies import Dependencies
from app.health import health
from app.http import ApiRequest, ApiResponse, error_response

type Handler = Callable[[ApiRequest, Dependencies], Awaitable[ApiResponse]]

ROUTES: dict[tuple[str, str], Handler] = {
    ("GET", "/api/health"): health,
    ("GET", "/api/contact/challenge"): get_challenge,
    ("POST", "/api/contact"): submit_contact,
}


async def dispatch(request: ApiRequest, dependencies: Dependencies) -> ApiResponse:
    handler = ROUTES.get((request.method, request.path))
    if handler is not None:
        return await handler(request, dependencies)
    allowed = sorted(method for method, path in ROUTES if path == request.path)
    if allowed:
        return error_response(405, "Method Not Allowed", {"allow": ", ".join(allowed)})
    return error_response(404, "Not Found")
