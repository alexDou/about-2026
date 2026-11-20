---
# portfolio-1b3v
title: 'Unit 4.0a: Backend becomes a Python Worker'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-20T12:30:26Z
updated_at: 2026-11-20T12:30:26Z
parent: portfolio-yxux
---

## Parent

portfolio-yxux Unit 4: Contact. Spec: portfolio-tn1x (Unit 4: Contact spec) and the Unit 4 section of docs_src/specs/units.md. Vocabulary: CONTEXT.md. ADR 0006.

## What to build

Prefactor: the backend stops being a FastAPI app and becomes a Python Worker on Cloudflare, with no web framework (ADR 0006). A thin entry module hands each request to a plain route table, which answers `/api/health` exactly as today, so the Landing badge and the offline notes keep working. Local development runs through `uv run pywrangler dev`, and the frontend dev server proxies `/api` to it. Everything except the entry module is plain Python that pytest runs in normal CPython.

## Acceptance criteria

- [ ] Worker project in `backend/` (uv, `pywrangler`, `python_workers` compatibility flag); FastAPI and uvicorn removed; Pydantic kept for contract models
- [ ] Only the entry module imports the Workers runtime; the route table and handlers are plain Python
- [ ] `GET /api/health` answers `{"status": "ok"}` as today; unknown `/api` paths answer 404
- [ ] `uv run pywrangler dev` serves the API locally; the frontend dev proxy targets its port
- [ ] Local secrets file set up and git-ignored (`MAIL_FROM`, `MAIL_TO`, `ALTCHA_HMAC_KEY`)
- [ ] pytest covers the route table and health with the request mocked; ruff green; verify.sh's backend lane still runs pytest and ruff
- [ ] AGENTS.md (architecture), `.claude/rules/backend.md` (no FastAPI, the handler shape, the dev port) and `.claude/rules/api-contract.md` updated; `backend/README.md` commands updated
- [ ] scripts/verify.sh GREEN

## Blocked by

- None (can start immediately)
