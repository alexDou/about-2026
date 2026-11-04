from fastapi import APIRouter, FastAPI

app = FastAPI(title="Portfolio API")

api = APIRouter(prefix="/api")


@api.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(api)
