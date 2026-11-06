---
name: feature-dev
description: Bean-driven feature development - read the bean, grill the gaps, write the design and a test-first task breakdown back into beans, then execute stage by stage. Use when starting a feature or epic bean, or when the user says "implement feature X" or "/feature-dev <bean-id>".
argument-hint: <bean-id or feature summary>
---

# Feature Development Protocol

The bean is the spec. Everything this skill decides is written back into beans, not left in the chat.

```text
Bean ──> Grilling ──> Exploration ──> Design (into bean) ──> Child beans ──> Execution
```

Never write production code before the design is in the bean and the user has approved it.

## Phase 0: Find the bean

- Argument is a bean ID → `beans show --json <id>`.
- Argument is a description → search first (`beans list --json -S "<keywords>"`). If no bean covers it, create one: `beans create --json "<title>" -t feature -s draft -d "<what the user asked for>"`.
- Mark it `in-progress` only when execution starts (Phase 5).

## Phase 1: Grilling

Check the bean against the code in `frontend/src/` and `backend/app/`:

1. **Boundaries:**
   - New or changed `/api` endpoint? Then the contract changes on both sides (`.claude/rules/api-contract.md`).
   - Which chunk owns the new code (`.claude/rules/structure.md`)? Does anything gain a second consumer and need promoting to a shared level?
   - Does it touch an animation loop (`requestAnimationFrame`, the AnimatedLogo weave) or the global tokens in `src/styles/`?
2. **Questions:** ask up to 3 targeted questions about edge cases, loading/error states, responsive behavior or fallbacks. Append the answers to the bean (`## Decisions`). Don't continue until they're answered or explicitly delegated.

## Phase 2: Exploration

1. Map affected files with LSP references, Grep and Glob.
2. Find components, hooks, services and types to reuse instead of duplicating.
3. Performance check: work added inside a `requestAnimationFrame` callback, effects re-running every render, new bundle weight, blocking calls in async routes.

## Phase 3: Design (written into the bean)

Append a `## Design` section to the bean (pipe multi-line text through stdin: `... | beans update <id> --body-append -`):

- **Contract:** exact Pydantic models and the matching TypeScript types, plus each new chunk's `index.ts` exports and props.
- **Data flow:** FastAPI route → service → hook → component.
- **Chunk layout:** folders and files to create, following the colocation rule.
- **Invariants:** what must stay true (e.g. "the logo animation never allocates per frame").

Present the design to the user. **Stop and wait for approval.**

## Phase 4: Test-first breakdown (child beans)

Create one child bean per stage, chained with `--blocked-by` so `beans list --ready` serves them in order. Each body holds its own `- [ ]` checklist and its gate:

- **Stage 0 — Contracts** (`-t task --parent <id>`): lock Pydantic models + matching TS types. Gate: backend `pytest` asserts the exact response shape; frontend `vitest` asserts the service parses it (mocked `fetch`).
- **Stage 1..N — Modules in isolation** (one per route/service/hook/component, `--blocked-by <stage-0-id>`): built against mocks of the contracts. Gate: that module's unit/component tests pass with nothing else running.
- **Stage Final — Connect** (`--blocked-by` every module bean): Cucumber + Playwright E2E on the real build and running backend. Gate: the flow works end to end, local API round trips stay under 50 ms, `scripts/verify.sh` is GREEN.

Small features may use a single bean with the three stages as checklist sections instead of children. Say which you chose.

## Phase 5: Execution

For each ready child bean (`beans list --json --ready --parent <id>`):

1. `beans update <child> -s in-progress`.
2. Red → green → refactor (see the `tdd` skill). Tick checklist items as they're done (`--body-replace-old "- [ ] X" --body-replace-new "- [x] X"`).
3. Run `scripts/verify.sh` until GREEN.
4. Append `## Summary of Changes`, set `-s completed`, commit code + bean files together: `type(scope): summary (<child-id>)`.

When every child is completed, complete the parent the same way.
