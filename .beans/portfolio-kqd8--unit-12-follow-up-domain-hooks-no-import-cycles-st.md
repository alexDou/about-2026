---
# portfolio-kqd8
title: 'Unit 1.2 follow-up: domain hooks, no import cycles, static title'
status: completed
type: task
priority: normal
created_at: 2026-11-09T15:04:43Z
updated_at: 2026-11-09T15:11:31Z
parent: portfolio-m9gt
---

## Parent

portfolio-m9gt (Unit 1: Board). The Owner's review of portfolio-u8a6 (Unit 1.2: FormatJS on the Landing).

## What to build

Three corrections from the Owner's review, plus two rules that future sessions must follow.

1. Domain code stays in its domain. `ApiHealth` is an ApiStatus domain type, and the health-check hook belongs to the ApiStatus domain, not to the global `hooks/`.
2. No circular dependencies, ever. Check the frontend for cycles now, and record the rule so it holds in every session.
3. A static, hard-coded site title in `index.html` covers the time until JS runs and every screen that sets no title of its own (`/explore`). The Landing keeps its title from messages. Where a hook's dependency list is certainly redundant, this one chunk may omit it, with a comment; no global rule.

## Acceptance criteria

- [x] Tests first where behaviour changes (TDD, per the rules)
- [x] `useApiHealth` lives in `components/domain/ApiStatus/hooks/`, and `ApiHealth` in the ApiStatus domain's types. The global `hooks/` keeps only domain-agnostic hooks.
- [x] The domain rule is written down for future sessions (`.claude/rules/frontend.md`, with no contradiction left in `structure.md` / `AGENTS.md`).
- [x] No import cycles in the frontend, enforced by tooling (`import/no-cycle`), and the rule is in `.claude/rules/frontend.md`.
- [x] `index.html` carries the static title "A.Durnev portfolio". The Landing's title from messages takes effect over it in a real browser, and leaving the Landing restores the static one.
- [x] `IntlProvider`'s `useMemo` omits its redundant dependency list, with a comment for that line only.
- [x] `pnpm --dir frontend e2e` green
- [x] `scripts/verify.sh` GREEN

## Decisions

- ApiStatus layout: `ApiHealth` is in `ApiStatus/types.ts`. The two lookup maps (`TONE_BY_HEALTH`, `LABEL_BY_HEALTH`) are constants, so they move to `ApiStatus/config.ts`. The hook is `ApiStatus/hooks/useApiHealth/{useApiHealth.ts, index.ts}`, with no `types.ts` of its own, because its only type is the domain's. `structure.md` now allows a hook folder without `types.ts`.
- Domain rule, applied to the shared case: domain code stays in its domain however many chunks use it, and other chunks import it through the domain's `index.ts`. For Unit 1.8 this means the Chat with me and Contact pages reach the health check through `ApiStatus`'s index.
- Cycles: oxlint's `import/no-cycle` (now on, with `ignoreTypes: false`) misses every cycle that runs through a `.tsrx` file. The TSRX docs list no import-graph support for `.tsrx`, and a probe confirmed it. `tools/import-cycles.ts` reads the relative imports of `.ts`/`.tsrx`/`.js` files (type-only imports and re-exports included, comments ignored), finds strongly connected components, and runs as `pnpm cycles` in the gate's frontend lane. Its tests run on throwaway trees, and a cycle planted in `ApiStatus` was caught.
- Title: the static `<title>A.Durnev portfolio</title>` stays first in `<head>`, so a `<title>` rendered by Octane would never show. The Landing sets `document.title` from `site.title` in an effect and restores the title it found on cleanup, which brings back the static default on `/explore`. `App.test.ts` checks that the hard-coded title equals `site.title`, so the tab text doesn't change when JS takes over.
- The Owner wrote the static title as "A.Durnev Portfolio". It follows the existing message and spec instead, "A.Durnev portfolio" with a lowercase p, because the static text and the message must match. Changing the case means changing both.
- `useMemo` in `IntlProvider`: no dependency list, and `// oxlint-disable-next-line react-hooks/exhaustive-deps -- <reason>` on that line only. Neither the lint config nor the frontend rule changes.

## Summary of Changes

- Domain: `useApiHealth` moved from `src/hooks/` into `components/domain/ApiStatus/hooks/`. `ApiHealth` is in the domain's `types.ts`, and the lookup maps are in `config.ts`.
- Cycles: `tools/import-cycles.ts` (+ tests, `vitest.config.ts` now includes `tools/**/*.test.ts`), the `pnpm cycles` script (also part of `pnpm check`), a gate step in `scripts/verify.sh`, and `import/no-cycle` with type imports counted in `.oxlintrc.json`. The tree has no cycles.
- Title: `index.html` carries `<title>A.Durnev portfolio</title>`. `LandingPage` sets and restores `document.title`. New tests cover the title shown over the static one, the restore on unmount, and the static title matching `site.title`.
- `IntlProvider`: `useMemo` with an inferred dependency list and a line-level lint exception.
- Rules: `.claude/rules/frontend.md` gains "Domain code stays in its domain", "Imports form no cycles" and the document-title note. `structure.md`, `AGENTS.md`, `octane-docs.md` and the verify skill's description now agree with it.
- Beans: portfolio-3n34 loses the Board title item (`/explore` shows the static default), and portfolio-u8a6 points here.
