import asyncio
import json

from app.http import ApiRequest, ApiResponse
from app.routes import dispatch


def call(method: str, path: str) -> ApiResponse:
    return asyncio.run(dispatch(ApiRequest(method=method, path=path)))


def test_health_answers_ok_as_json() -> None:
    response = call("GET", "/api/health")
    assert response.status == 200
    assert response.headers["content-type"] == "application/json"
    assert json.loads(response.body) == {"status": "ok"}


def test_unknown_api_path_answers_404() -> None:
    response = call("GET", "/api/nope")
    assert response.status == 404
    assert json.loads(response.body) == {"detail": "Not Found"}


def test_path_outside_api_answers_404() -> None:
    assert call("GET", "/health").status == 404


def test_known_path_with_another_method_answers_405() -> None:
    response = call("POST", "/api/health")
    assert response.status == 405
    assert response.headers["allow"] == "GET"
    assert json.loads(response.body) == {"detail": "Method Not Allowed"}
