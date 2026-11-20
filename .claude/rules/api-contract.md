---
paths: ["backend/src/**/*.py", "frontend/src/services/**/*.ts"]
---
# API Contract: frontend ↔ backend

There is no codegen. Each side owns its own types, and they must match exactly. The contract is the source of truth (Stage 0 of every unit).

## Where the types live

- Backend: Pydantic models next to the handler that serves them (`backend/src/app/...`).
- Frontend: the matching `type` in the service chunk that calls the endpoint (`frontend/src/services/<area>/types.ts`).

## Invariants

- Field names, optionality and literal values are identical on both sides. An optional field (`field?` in TS, `T | None = None` in Python) is left out of the JSON when it has no value, never sent as `null`: `json_response` drops `None` fields, and a request model refuses an explicit `null` where zod's `.optional()` does. A field that really can be `null` needs both sides changed together. A literal union in TS (`status: "ok"`) is a `Literal["ok"]` or an `Enum` in Python, never a bare `str`.
- One contract change = one commit touching both sides plus their tests.
- Each side locks the contract with its own test before any feature code uses it:
  - backend: `pytest` asserts the exact JSON shape and the status codes: on the Pydantic models in Stage 0 (`tests/contact/test_models.py`), and through the route table (`dispatch()`) once the endpoint exists;
  - frontend: `vitest` asserts the service parses that same shape (mocked `fetch`).
- UI code never calls `fetch` directly. It goes through `services/`, usually behind a hook.
