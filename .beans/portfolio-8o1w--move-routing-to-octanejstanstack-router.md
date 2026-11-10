---
# portfolio-8o1w
title: Move routing to @octanejs/tanstack-router
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-10T12:18:03Z
updated_at: 2026-11-10T12:18:03Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-4zpt
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Decision: ADR 0004. Vocabulary: `CONTEXT.md`.

## Why

Unit 1.3 built an own route hook over the History API, and Unit 1.5 grew hand-built extras on it (scroll-restoration switch in the store, `link()` click handling, canonical-URL replacement). The reasons for "no router" no longer hold: `@octanejs/tanstack-router` exists (peer `octane ^0.16`, reuses `@tanstack/router-core`), and the animation design no longer depends on knowing what caused a route change. Units 1.6 and 1.7 build on route state, so the swap comes first.

## What to build

Routing runs on `@octanejs/tanstack-router` with code-defined routes (no file-based routes, no code generator). Behaviour for the Visitor does not change, except the animation rule below. `userTriggered` goes away: every route change plays its transition, whatever caused it (click, direct visit, reload, Back/Forward). The site keeps no record of the cause of a change or of what was open before. This bean only removes the distinction; the sequences themselves are Unit 1.6/1.7.

## Scope

- Add `@octanejs/tanstack-router` with `pnpm --dir frontend add` (pnpm only). Pin the version like the other dependencies.
- **Routes**: `/` Landing, `/explore` Board, `/about`, `/what-i-do`, `/skills`, `/chat`, `/contact`. The Panel ids, their order and their paths stay ours (`hooks/useRoute`, `PANEL_IDS`, the id ↔ path map); the routes are built from them. The router's route types replace `Route`/`RoutePath` where they overlap. `BoardState` (`default | expanded(panel)`) stays the domain type, derived from the matched route.
- **Public interface**: keep `hooks/useRoute` as the one place the rest of the app imports routing from (a thin layer over the router). Its surface stays small: the current route/Board state, `navigate`, and a link helper. Consumers (`App`, `LandingPage`, `Board`, `Panel`, and the Stripe wiring in `Board`) do not import the router package directly unless it is cleaner (decide while building, and record it in the bean).
- **Links**: Panel titles and Stripes stay real `<a href>` links. A plain click is handled in the app, a modified or middle click goes to the browser. Prefer the router's `Link`; if it cannot take our `class`/`onClick`/focus needs, keep a plain `<a>` with the router's `navigate`.
- **Canonical URLs**: an unknown path is replaced by `/` and a trailing slash is dropped, both without a history entry (router options or a catch-all redirect with `replace`). Verify the option names against the Octane binding's real API before relying on them.
- **History**: every state change adds an entry, the logo click included. Back from `/explore` shows the Landing.
- **Scroll**: browser scroll restoration is off and every Board state starts at the top. Use the router's own scroll options if the binding supports them; otherwise keep `useScrollReset` and the one-line `scrollRestoration = "manual"`, now set where the router is created. Either way it applies before any page renders (an effect is too late on a reload).
- **No more `userTriggered`**: remove it from the route state, from `useRoute()` and from its tests. In `Board`, the `entrance` class is always on and `unfolding` starts `true` (the unfold plays whenever the Board mounts); opening a Panel still ends `unfolding`, so Panels that return on close do not replay it (Unit 1.6 replaces this with stable slots).
- **Delete** what the router makes redundant: `hooks/useRoute/store.ts`, `links.ts`, `routes.ts` (`resolvePath`, `pathOf` where the router covers them), their `_specs_`, and any dead types. Move the tests that still describe behaviour (URL ↔ state, canonical URLs, links, history) to run against the router-backed hook.
- **Unchanged**: `useDocumentTitle`, `useThemeColor`, `useBoardFocus`, `useScrollReset` (unless the router replaces it), `Heading`, the pages, messages.

## Acceptance criteria

- [ ] Unit and integration tests written first and red, then green (TDD, per the rules). The behaviour tests that exist today (App deep links, Back/Forward walks, canonical URLs, plain vs modified clicks, history entry per change, scroll to top, document title and `theme-color`) stay and pass against the router-backed code. Tests that assert "no entrance on a direct visit / Back / Forward" are rewritten to assert the opposite.
- [ ] `@octanejs/tanstack-router` is the only routing code path; the own store, `popstate` handling and `pushState` calls are gone from `src/`.
- [ ] The seven URLs render the right state on a direct visit; an unknown path is replaced by `/` and a trailing slash dropped, with no history entry.
- [ ] Panel titles and Stripes are real links; a plain click navigates in the app without a reload, Ctrl/Meta/middle-click is left to the browser.
- [ ] Every change adds one history entry and Back/Forward walk through them (Landing → Board → Panel → another Panel → close).
- [ ] Browser scroll restoration is off from the first paint on a reload, and every Board state starts at the top.
- [ ] `userTriggered` no longer exists anywhere in `src/` or `e2e/`. The Board's unfold plays on every Board mount: logo click, direct `/explore`, reload, Back/Forward from the Landing. Reduced motion: instant.
- [ ] E2E: `board-look.feature` scenarios "does not unfold on a direct visit" and "does not unfold on Forward from the Landing" now assert the unfold plays; the "reload marker" scenario in `routing.feature` still proves a plain click does not reload the document.
- [ ] The production bundle size (gzip, from `pnpm --dir frontend build`) is measured before and after and both numbers are written in the bean's summary and in ADR 0004's Consequences. If the increase is large for a Landing first paint, stop and report it before committing.
- [ ] `.claude/rules/frontend.md` and `docs/adr/0004-…` are consistent with the result (no mention of the own route hook as the routing layer); `docs_src/specs/units.md` already describes the new rule.
- [ ] `pnpm --dir frontend e2e` run; failures outside this diff are reported by name (7 `board-look` scenarios fail on `main` already: the phone dots, centred titles and "unfold has ended").
- [ ] `scripts/verify.sh` GREEN

## Out of scope

- The expand/collapse sequences and stable slots (Unit 1.6), the final entrance tuning (Unit 1.7).
- File-based routes, code splitting per route, search params, preloading.
- The focus/ref refactor of `useBoardFocus` and merging the per-Panel config tables: separate follow-up beans.

## Risks to check early

- The binding is 0.x and pins `@tanstack/router-core` exactly; confirm it works with the Rspack build and `tsrs --runExternalCode` type check before migrating anything.
- The option names for trailing slash, not-found/redirect and scroll handling come from TanStack Router in general and are not yet verified against the Octane binding.
- `isbot` is a dependency of the binding (SSR); make sure it does not end up in the client bundle without need.

## Blocking

- portfolio-1syg (Unit 1.6) and portfolio-t6ex (Unit 1.7) build on the new route state.
