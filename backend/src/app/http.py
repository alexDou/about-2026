"""Plain request and response values: what handlers see instead of the Workers runtime."""

from collections.abc import Mapping
from dataclasses import dataclass, field

from pydantic import BaseModel


@dataclass(frozen=True)
class ApiRequest:
    """One HTTP request. Header names are lower-case."""

    method: str
    path: str
    headers: Mapping[str, str] = field(default_factory=dict)
    body: bytes = b""


@dataclass(frozen=True)
class ApiResponse:
    """One HTTP response. Header names are lower-case; an empty body is sent as no body."""

    status: int
    body: str = ""
    headers: Mapping[str, str] = field(default_factory=dict)


class ErrorResponse(BaseModel):
    """Every error answers `{"detail": ...}` with a stable, static message."""

    detail: str


def json_response(
    model: BaseModel, status: int = 200, headers: Mapping[str, str] | None = None
) -> ApiResponse:
    return ApiResponse(
        status=status,
        body=model.model_dump_json(),
        headers={"content-type": "application/json", **(headers or {})},
    )


def error_response(
    status: int, detail: str, headers: Mapping[str, str] | None = None
) -> ApiResponse:
    return json_response(ErrorResponse(detail=detail), status, headers)
