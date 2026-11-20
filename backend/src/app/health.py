"""`GET /api/health`: the Landing badge and the offline notes ask it whether the API is up."""

from typing import Literal

from pydantic import BaseModel

from app.dependencies import Dependencies
from app.http import ApiRequest, ApiResponse, json_response


class HealthResponse(BaseModel):
    status: Literal["ok"]


async def health(_request: ApiRequest, _dependencies: Dependencies) -> ApiResponse:
    return json_response(HealthResponse(status="ok"))
