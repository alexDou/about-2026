# Portfolio Units (Vertical Walking Skeletons)

Each unit is a complete, test-verified end-to-end slice through both tiers: the Octane frontend (`frontend/`) and the FastAPI backend (`backend/`).

## Specification & Ticket Breakdown Protocol: Contract-First Staging

All unit specifications, task matrices, and ticket breakdowns follow a strict 3-stage lifecycle:

1. **Stage 0: Domains, Interfaces & Contracts First (`Unit X.0`)**:
   - Single source of truth: lock the Pydantic models and the matching frontend TS types (no codegen, they must match field for field — `.claude/rules/api-contract.md`).
   - Contract tests on both sides (`pytest` response shape, `vitest` service parsing) pass before any feature code starts.
2. **Stage 1..N: Subsystem Modules in Isolation (`Unit X.1`, `X.2`, `X.3`, ...)**:
   - Develop each module (FastAPI route, service, hook, component) against mocks built on the contracts.
   - No running backend needed for frontend work and vice versa.
   - Verified hermetically with offline unit/component tests (`pytest`, `vitest`).
3. **Stage Final: Connect Everything Together (`Unit X.N`)**:
   - Cucumber + Playwright E2E against the real frontend build and running backend.
   - Verifies the live end-to-end flow and the latency budget (<50ms).

---

<!-- Units go below: ## Unit 1: <name>, with Objective, Sub-Unit Breakdown (X.0 … X.N) and Definition of Done. -->
