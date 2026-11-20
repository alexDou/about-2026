---
# portfolio-1b3v
title: 'Unit 4.0a: Backend becomes a Python Worker'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-20T12:30:26Z
updated_at: 2026-11-20T12:53:09Z
parent: portfolio-yxux
---

## Parent

portfolio-yxux Unit 4: Contact. Spec: portfolio-tn1x (Unit 4: Contact spec) and the Unit 4 section of docs_src/specs/units.md. Vocabulary: CONTEXT.md. ADR 0006.

## What to build

Prefactor: the backend stops being a FastAPI app and becomes a Python Worker on Cloudflare, with no web framework (ADR 0006). A thin entry module hands each request to a plain route table, which answers `/api/health` exactly as today, so the Landing badge and the offline notes keep working. Local development runs through `uv run pywrangler dev`, and the frontend dev server proxies `/api` to it. Everything except the entry module is plain Python that pytest runs in normal CPython.

## Acceptance criteria

- [x] Worker project in `backend/` (uv, `pywrangler`, `python_workers` compatibility flag); FastAPI and uvicorn removed; Pydantic kept for contract models
- [x] Only the entry module imports the Workers runtime; the route table and handlers are plain Python
- [x] `GET /api/health` answers `{"status": "ok"}` as today; unknown `/api` paths answer 404
- [x] `uv run pywrangler dev` serves the API locally; the frontend dev proxy targets its port
- [x] Local secrets file set up and git-ignored (`MAIL_FROM`, `MAIL_TO`, `ALTCHA_HMAC_KEY`)
- [x] pytest covers the route table and health with the request mocked; ruff green; verify.sh's backend lane still runs pytest and ruff
- [x] AGENTS.md (architecture), `.claude/rules/backend.md` (no FastAPI, the handler shape, the dev port) and `.claude/rules/api-contract.md` updated; `backend/README.md` commands updated
- [x] scripts/verify.sh GREEN

## Blocked by

- None (can start immediately)

## Decisions

- Layout: `backend/src/entry.py` (wrangler `main`) plus the package `backend/src/app/`. Wrangler uploads the Python modules under the entry's folder, so `app/` moved under `src/`, and every rule, skill and Opengrep path that named `backend/app/` now names `backend/src/` or `backend/src/app/`.
- Python 3.14: `compatibility_date` 2026-11-20 makes pywrangler and the runtime pick Python 3.14 (3.14 from 2026-09-08), so `.python-version`, `requires-python` and ruff's target are 3.14 and pytest runs the Worker's Python.
- Local secrets: wrangler 4.165 reads the existing git-ignored `backend/.env` as secrets ("Using secrets defined in .env"), so no second file. `.dev.vars*`, `python_modules`, `.venv-workers` and `.wrangler` are ignored in `backend/.gitignore`.
- Dev port 8787, set in `wrangler.jsonc`; the Rspack proxy targets it.
- A known path with another method answers 405 with `Allow`, as FastAPI did; errors are `{"detail": ...}` as before.
- Proven locally with `uv run pywrangler dev`: `GET /api/health` 200 `{"status":"ok"}` with Pydantic vendored under Pyodide, `/api/nope` 404, `POST /api/health` 405.
- pywrangler needs uv >= 0.13.4; this machine has 0.9.26, so the run used a cached uv 0.13.9 on PATH (`uvx --from 'uv>=0.13.4'`). The Owner's global uv is unchanged.
- Follow-up: portfolio-pcnc (Opengrep backend rules still match FastAPI shapes; agent docs wording).

## Summary of Changes

- FastAPI app and its test removed; FastAPI, uvicorn and httpx dropped; Pydantic is a direct dependency; `workers-py` and `workers-runtime-sdk` are dev dependencies.
- `backend/wrangler.jsonc`, `src/entry.py` (the only runtime import), `src/app/http.py` (`ApiRequest`, `ApiResponse`, `json_response`, `error_response`), `src/app/routes.py` (`ROUTES`, `dispatch`), `src/app/health.py` (`HealthResponse`).
- `tests/test_routes.py`: health JSON, 404 inside and outside `/api`, 405 with `Allow`.
- Frontend dev proxy on `:8787`. AGENTS.md, README.md, `backend/README.md`, `.claude/rules/{backend,api-contract,structure,opengrep}.md`, pr-toolkit and feature-dev skills updated.
