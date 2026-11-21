# Fixtures for backend.yml, run with `opengrep test .opengrep/rules`.
import json

from workers import fetch

AGENT_URL = "https://agent.example/v1/chat"

# ok: backend-route-outside-api
ROUTES: dict[tuple[str, str], object] = {
    # ok: backend-route-outside-api
    ("GET", "/api/health"): health,
    # ok: backend-route-outside-api
    ("POST", "/api/contact"): contact,
    # ruleid: backend-route-outside-api
    ("GET", "/health"): health,
    # ruleid: backend-route-outside-api
    ("POST", "/contact"): contact,
    # ruleid: backend-route-outside-api
    ("GET", "/apis/contact"): contact,
}

# ok: backend-route-outside-api
OTHER_TABLE = {("GET", "/health"): health}


async def contact(request: ApiRequest, dependencies: Dependencies) -> ApiResponse:
    try:
        store(request.body)
    except ValueError as err:
        # ruleid: backend-exception-text-in-response
        return error_response(400, str(err))
    except KeyError as err:
        # ruleid: backend-exception-text-in-response
        return error_response(400, f"bad key {err}")
    except TypeError as err:
        # ruleid: backend-exception-text-in-response
        return error_response(400, detail=repr(err))
    except OSError as err:
        # ruleid: backend-exception-text-in-response
        return json_response(ErrorResponse(detail=str(err)), 500)
    except ArithmeticError as err:
        # ruleid: backend-exception-text-in-response
        return json_response(ErrorResponse(detail=str(err)), 500)
    except EOFError as err:
        # ruleid: backend-exception-text-in-response
        failure = ErrorResponse(detail=str(err))
        return json_response(failure, 500)
    except LookupError as err:
        # ruleid: backend-exception-text-in-response
        return ApiResponse(status=500, body=str(err))
    except RuntimeError as err:
        log(err)
        # ok: backend-exception-text-in-response
        return error_response(500, "Request not stored")
    except UnicodeError as err:
        log(err)
        # ok: backend-exception-text-in-response
        return json_response(ErrorResponse(detail="Request not stored"), 500)
    except ImportError as err:
        log(err)
        # ok: backend-exception-text-in-response
        return ApiResponse(status=500, body="Request not stored")
    return ApiResponse(status=204)


async def chat(request: ApiRequest, dependencies: Dependencies) -> ApiResponse:
    callback = json.loads(request.body)["callback"]
    # ok: backend-request-data-in-outbound-url
    await fetch(AGENT_URL, method="POST", body=request.body)
    # ruleid: backend-request-data-in-outbound-url
    await fetch(request.headers["x-callback"])
    # ruleid: backend-request-data-in-outbound-url
    await fetch(f"https://{request.path}/hook")
    # ruleid: backend-request-data-in-outbound-url
    await dependencies.agent.fetch(callback)
    # ruleid: backend-request-data-in-outbound-url
    urlopen(request.body.decode())
    # ruleid: backend-request-data-in-outbound-url
    await dependencies.agent.pyfetch(callback)
    # ruleid: backend-request-data-in-outbound-url
    request_module.urlopen(request.path)
    return ApiResponse(status=204)


def sync_chat(request: ApiRequest) -> None:
    # ruleid: backend-request-data-in-outbound-url
    pyfetch(request.path)


def store(body: bytes) -> None: ...


def log(err: Exception) -> None: ...
