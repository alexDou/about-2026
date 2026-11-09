# Personal Portfolio

## System Architecture

Decoupled frontend/backend architecture following Clean Architecture & Ousterhout Deep Modules:

- **Frontend (`frontend/`)**: Octane SPA (React-style, compiled) · components in TSRX (`.tsrx`) · TypeScript 7 type-checked by tsrs · Rspack bundler · Oxc for TS stripping, minify, lint (`oxlint`) and format (`oxfmt`), both served by `@tsrx/oxc` · CSS Modules · Vitest · Cucumber + Playwright. Package manager: pnpm only.
- **Backend (`backend/`)**: Python 3.13 · FastAPI · uv · pytest · ruff. All routes under `/api`; the frontend dev server proxies `/api` to `:8000`.
- **Contract**: JSON over HTTP. No codegen: each side owns its types and they match field for field (`.claude/rules/api-contract.md`).

## Development Methodology

- **Bean-driven work**: every task is a bean in `.beans/`. The bean body is the spec and the checklist; work starts from it and ends by completing it. See `docs/agents/issue-tracker.md`.
- **Specification Driven Development (SDD)**: the units roadmap lives in `docs_src/specs/units.md`. Each unit becomes an epic bean with one child bean per stage.
- **Contract-First Staged Architecture (Spec & Ticket Generation Protocol)**:
  Every unit or feature specification and bean breakdown strictly follows a 3-stage lifecycle:
  1. **Stage 0: Domains, Interfaces & Contracts First (`Unit X.0`)**: Single source of truth. Where data crosses HTTP, backend and frontend maintain their own types that strictly match and serve as data contracts, locked with a contract test on each side. Where content is static frontend JSON, its TS type plus a test validating the JSON is the contract. Lock contracts before implementing features.
  2. **Stage 1..N: Modules in Isolation (`Unit X.1`, `X.2`, `X.3`, ...)**: Develop each module of the scope (route, service, hook, component) against mocks built on the contracts. No running backend needed for frontend work, and vice versa. Verify each module with its unit/component tests (`pytest`, `vitest`).
  3. **Stage Final: Connect Everything Together (`Unit X.N`)**: Cucumber + Playwright E2E against the real frontend build, plus the running backend for units that use it. Validates the full user flow and the response-time budget (<50ms per local API round trip).
- **Test-Driven Development (TDD)**: Every task begins with a failing test (red → green → refactor).
  - Backend: `uv run --directory backend pytest`, `uv run --directory backend ruff check .`
  - Frontend: `pnpm --dir frontend test`, `pnpm --dir frontend lint`, `pnpm --dir frontend typecheck`
- **End-of-Task Gate (mandatory)**: Every task that changes files ends with `scripts/verify.sh` (frontend and backend checks in parallel: tests + linters + formatters + typecheck + import cycles, then semgrep when rules exist). A task is not done, and must not be committed, until it prints `verify: GREEN`. Pre-existing failures outside your diff are reported by name, never hidden or silenced.

## Code Organization & Directory Invariants

Full rule: `.claude/rules/structure.md`.

- **Modular, split on reasonable borders**: no big modules. A file or folder doing two jobs gets split.
- **Colocation**: everything that belongs to a chunk (component, page, hook, service) lives inside that chunk. A hook, helper, type or sub-component used by one chunk only lives in that chunk, e.g. `components/domain/APage/{hooks/, utils.ts, types.ts, styles.module.css, APage.tsrx, index.ts}`.
- **Shared levels are for shared code**: `hooks/`, `utils/` and `components/ui/` hold domain-agnostic code used by two or more chunks. Promote code up when a second consumer appears; move it back down when it's down to one. Domain code stays in its domain chunk, and imports form no cycles (`.claude/rules/frontend.md`).
- **Public interface**: import a chunk only through its `index.ts`, never its internal files.
- **Frontend layout** (`frontend/src/`): `app/`, `pages/<Page>/`, `components/ui/<Name>/` (presentational, no data fetching), `components/domain/<Name>/` (feature parts), `hooks/<useX>/`, `services/<area>/`, `utils/`, `i18n/` (FormatJS setup and messages), `styles/`.
- **Component folder**: `<Name>.tsrx`, `index.ts`, `types.ts`, `styles.module.css`, plus `<Name>.test.ts`. Props types never inline; components never share a stylesheet.
- **Tests**: unit tests colocated next to the code they test. Frontend E2E in `frontend/e2e/`. Backend tests in `backend/tests/`.
- **Styling**: CSS Modules only. No Tailwind, no CSS-in-JS, no `style` props (oxlint enforces it).

## Tracking & Docs

- **Issue Tracker**: beans (`.beans/`, config `.beans.yml`, IDs `portfolio-xxxx`). See `docs/agents/issue-tracker.md`.
- **Triage Labels**: 5 canonical tags (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), applied as bean tags. See `docs/agents/triage-labels.md`.
- **Domain Docs**: Single-context domain model in `CONTEXT.md`. Architecture decisions in `docs/adr/`. See `docs/agents/domain.md`.
