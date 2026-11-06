---
paths: ["backend/**/*.py"]
---
# Backend: FastAPI, Python 3.13, uv

## Tooling

- Python and deps are managed by **uv** only: `uv add`, `uv sync`, `uv run`. Never `pip install` or a hand-made venv.
- Run from `backend/`, or pass `uv run --directory backend ...`.
- Lint and format with ruff (`uv run ruff check .`, `uv run ruff format .`). Config lives in `backend/pyproject.toml`.
- Tests: `uv run pytest`, with FastAPI's `TestClient` (httpx).

## API shape

- Every route lives under the `/api` router. The frontend dev server proxies `/api` to `:8000`.
- Request and response bodies are Pydantic models with a declared `response_model` or return type. Never return untyped dicts from new endpoints.
- Errors: raise `HTTPException` with a stable `detail`. Never put raw exception text or tracebacks in a response. Log the detail server-side.

## AI providers

The cloud AI-model provider for delegated tasks is **not chosen yet**. Don't pick or wire one without asking the user.
