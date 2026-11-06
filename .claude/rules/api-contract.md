---
paths: ["backend/app/**/*.py", "frontend/src/services/**/*.ts"]
---
# API Contract: frontend ↔ backend

There is no codegen. Each side owns its own types, and they must match exactly. The contract is the source of truth (Stage 0 of every unit).

## Where the types live

- Backend: Pydantic models next to the router that serves them (`backend/app/...`).
- Frontend: the matching `type` in the service chunk that calls the endpoint (`frontend/src/services/<area>/types.ts`).

## Invariants

- Field names, optionality and literal values are identical on both sides. A literal union in TS (`status: "ok"`) is a `Literal["ok"]` or an `Enum` in Python, never a bare `str`.
- One contract change = one commit touching both sides plus their tests.
- Each side locks the contract with its own test before any feature code uses it:
  - backend: `pytest` asserts the endpoint's exact JSON shape;
  - frontend: `vitest` asserts the service parses that same shape (mocked `fetch`).
- UI code never calls `fetch` directly. It goes through `services/`, usually behind a hook.
