# Fixtures for backend.yml, run with `opengrep test .opengrep/rules`.
import httpx
from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware import Middleware

app = FastAPI(title="Portfolio API")
api = APIRouter(prefix="/api")
AGENT_URL = "https://agent.example/v1/chat"


# ruleid: backend-route-outside-api-router
@app.get("/health")
async def bare_health() -> dict[str, str]:
    return {"status": "ok"}


# ruleid: backend-route-outside-api-router
@app.post("/contact")
def bare_contact() -> None:
    return None


# ok: backend-route-outside-api-router
@api.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


# ruleid: backend-route-outside-api-router
app.add_api_route("/x", health)
# ok: backend-route-outside-api-router
app.include_router(api)


@api.post("/contact")
async def contact(name: str) -> dict[str, str]:
    try:
        store(name)
    except ValueError as err:
        # ruleid: backend-exception-text-in-response
        raise HTTPException(status_code=400, detail=str(err)) from err
    except KeyError as err:
        # ruleid: backend-exception-text-in-response
        raise HTTPException(400, f"bad key {err}") from err
    except OSError as err:
        # ruleid: backend-exception-text-in-response
        return JSONResponse({"error": repr(err)}, status_code=500)
    except RuntimeError as err:
        log(err)
        # ok: backend-exception-text-in-response
        raise HTTPException(status_code=500, detail="Request not stored") from err
    return {"status": "stored"}


# ruleid: backend-cors-wildcard
app.add_middleware(CORSMiddleware, allow_origins=["*"])
# ruleid: backend-cors-wildcard
app.add_middleware(CORSMiddleware, allow_origin_regex=".*")
# ruleid: backend-cors-wildcard
middleware = [Middleware(CORSMiddleware, allow_origins=["https://a.example", "*"])]
# ok: backend-cors-wildcard
app.add_middleware(CORSMiddleware, allow_origins=["https://portfolio.example"])


@api.post("/chat")
async def chat(message: str, callback: str) -> dict[str, str]:
    async with httpx.AsyncClient() as client:
        # ok: backend-request-data-in-outbound-url
        await client.post(AGENT_URL, json={"message": message})
        # ruleid: backend-request-data-in-outbound-url
        await client.get(callback)
        # ruleid: backend-request-data-in-outbound-url
        httpx.get(f"https://{callback}/hook")
    # ruleid: backend-request-data-in-outbound-url
    httpx.AsyncClient(base_url=callback)
    return {"status": "sent"}


def store(name: str) -> None: ...


def log(err: Exception) -> None: ...
