---
paths: ["backend/**/*.py", "backend/wrangler.jsonc", "backend/pyproject.toml"]
---
# Backend: a Python Worker on Cloudflare, Python 3.14, uv

The API is a Python Worker (Pyodide) with no web framework (ADR 0006). FastAPI, Starlette and uvicorn are not used.

## Tooling

- Python and deps are managed by **uv** only: `uv add`, `uv sync`, `uv run`. Never `pip install` or a hand-made venv.
- Run from `backend/`, or pass `uv run --directory backend ...`.
- Local dev: `uv run pywrangler dev` serves the Worker on `http://127.0.0.1:8787` (`dev` in `wrangler.jsonc`). The frontend dev server proxies `/api` there. pywrangler needs uv ≥ 0.13.4 and Node (it runs wrangler through npx); it vendors `[project].dependencies` into `python_modules/` (git-ignored), pinned by `pylock.toml` (committed, like `uv.lock`).
- Local secrets: wrangler reads `backend/.env` (git-ignored). Never commit values. The names are in `backend/README.md`.
- `compatibility_date` in `wrangler.jsonc` also picks the Worker's Python version; `.python-version` and `requires-python` follow it, so pytest runs the Python the Worker runs.
- Lint and format with ruff (`uv run ruff check .`, `uv run ruff format .`). Config lives in `backend/pyproject.toml`.
- Tests: `uv run pytest`, in plain CPython. They call `dispatch()` (or a handler) with an `ApiRequest` and assert on the `ApiResponse`; dependencies are mocked along their contracts.

## Layout

- `src/entry.py`: the Worker's entry and the **only** module that imports the Workers runtime (`workers`, `js`). It turns the runtime request into an `ApiRequest`, calls `dispatch()` and turns the `ApiResponse` back. Keep it thin; it is not unit-tested.
- `src/app/`: plain Python. `http.py` (the `ApiRequest` / `ApiResponse` values, `json_response`, `error_response`), `routes.py` (the route table), one module or package per feature area (`health.py`, `contact/`).
- Tests in `backend/tests/` mirror `src/app/` (`app/routes.py` → `tests/test_routes.py`).

## API shape

- Every route is a row in `ROUTES` (`src/app/routes.py`), keyed by method and exact path, and the path starts with `/api/`. An unknown path answers 404, a known path with another method 405.
- A handler is `async def handler(request: ApiRequest, dependencies: Dependencies) -> ApiResponse`. `Dependencies` (`src/app/dependencies.py`) holds what a handler needs from the runtime as plain Python values: the mailer (a `ContactMailer`, whose `EmailMailer` wraps the `send_email` binding with `MAIL_FROM` and `MAIL_TO`) and the clock. `entry.py` builds it per request and passes it to `dispatch(request, dependencies)`; tests pass mocks. Nothing in `app/` imports the runtime. Add a field when a handler needs one (the human check's key in 4.6, the rate limiter in 4.7).
- Request and response bodies are Pydantic models, sent with `json_response(model)` (by alias, `None` fields left out: `api-contract.md`). Never hand-build JSON strings or return untyped dicts.
- Errors: `error_response(status, detail)` with a stable, static `detail`. Never put raw exception text or tracebacks in a response. Log the detail server-side.
- A response with an empty body is sent with no body (204 must have none).

## AI providers

The cloud AI-model provider for delegated tasks is **not chosen yet**. Don't pick or wire one without asking the user.
