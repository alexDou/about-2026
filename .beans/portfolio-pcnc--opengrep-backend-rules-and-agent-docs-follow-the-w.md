---
# portfolio-pcnc
title: Opengrep backend rules and agent docs follow the Worker
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-20T12:52:55Z
updated_at: 2026-11-21T16:02:53Z
parent: portfolio-yxux
---

## Parent

portfolio-yxux Unit 4: Contact. Follow-up of portfolio-1b3v (Unit 4.0a), ADR 0006.

## What to build

4.0a removed FastAPI, but some guards and agent docs still describe it. The Opengrep backend rules (`.opengrep/rules/backend.yml` + `backend.py` fixtures) match FastAPI shapes (`FastAPI(...)` routes, `HTTPException`, `JSONResponse`, `CORSMiddleware`, decorated route params as SSRF sources), so they match nothing in the Worker's handlers. Retarget them at the handler shape in `.claude/rules/backend.md`: exception text in `error_response` / `json_response`, route paths outside `/api/` in `ROUTES`, `ApiRequest` fields as taint sources for outbound URLs; drop what no longer applies (CORS middleware), with `# ruleid:` / `# ok:` fixtures for each.

## Acceptance criteria

- [x] `backend.yml` rules and fixtures target the Worker handler shape; FastAPI-only rules removed or replaced
- [x] FastAPI wording gone from `.claude/agents/code-reviewer.md`, `.claude/skills/feature-dev/SKILL.md` (data flow), `docs/agents/domain.md`, and the comments in `frontend/src/components/domain/api-status/{config,types}.ts`
- [x] scripts/verify.sh GREEN

## Summary of Changes

- `backend.yml` / `backend.py` retargeted at the Worker handler shape: `backend-route-outside-api` (paths in `ROUTES` outside `/api/`), `backend-exception-text-in-response` (exception text in `error_response`, `json_response`, `ErrorResponse`, `ApiResponse` inside `except ... as err`) and `backend-request-data-in-outbound-url` (`ApiRequest` path, headers and body into `fetch`, `pyfetch`, `urlopen`). Each pattern has `# ruleid:` and `# ok:` fixtures.
- `backend-cors-wildcard` dropped: the SPA and the API are one origin, there is no CORS middleware. The old route rule was renamed from `backend-route-outside-api-router`.
- FastAPI wording replaced in `.claude/agents/code-reviewer.md`, `.claude/skills/feature-dev/SKILL.md`, `docs/agents/domain.md` and the api-status comments (`config.ts`, `types.ts`, plus the same line in `ApiStatus.tsrx`).
