"""The route table: every `/api` endpoint, matched on method and exact path."""

from collections.abc import Awaitable, Callable

from app.health import health
from app.http import ApiRequest, ApiResponse, error_response

type Handler = Callable[[ApiRequest], Awaitable[ApiResponse]]

ROUTES: dict[tuple[str, str], Handler] = {
    ("GET", "/api/health"): health,
}


async def dispatch(request: ApiRequest) -> ApiResponse:
    handler = ROUTES.get((request.method, request.path))
    if handler is not None:
        return await handler(request)
    allowed = sorted(method for method, path in ROUTES if path == request.path)
    if allowed:
        return error_response(405, "Method Not Allowed", {"allow": ", ".join(allowed)})
    return error_response(404, "Not Found")
