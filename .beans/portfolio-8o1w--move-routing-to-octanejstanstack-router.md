---
# portfolio-8o1w
title: Move routing to @octanejs/tanstack-router
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-10T12:18:03Z
updated_at: 2026-11-10T12:56:43Z
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
- **Delete** what the router makes redundant: `hooks/useRoute/store.ts`, `resolvePath` and the URL ↔ state table (`routes.ts` shrank to `pathOf` and the Board state helpers, renamed `board.ts`), their `_specs_`, and any dead types. `links.ts` (`isPlainClick`) stays: Panel titles and Stripes are plain `<a>` elements, not the router's `Link`. Move the tests that still describe behaviour (URL ↔ state, canonical URLs, links, history) to run against the router-backed hook.
- **Unchanged**: `useDocumentTitle`, `useThemeColor`, `useBoardFocus`, `useScrollReset` (unless the router replaces it), `Heading`, the pages, messages.

## Acceptance criteria

- [x] Unit and integration tests written first and red, then green (TDD, per the rules). The behaviour tests that exist today (App deep links, Back/Forward walks, canonical URLs, plain vs modified clicks, history entry per change, scroll to top, document title and `theme-color`) stay and pass against the router-backed code. Tests that assert "no entrance on a direct visit / Back / Forward" are rewritten to assert the opposite.
- [x] `@octanejs/tanstack-router` is the only routing code path; the own store, `popstate` handling and `pushState` calls are gone from `src/`.
- [x] The seven URLs render the right state on a direct visit; an unknown path is replaced by `/` and a trailing slash dropped, with no history entry.
- [x] Panel titles and Stripes are real links; a plain click navigates in the app without a reload, Ctrl/Meta/middle-click is left to the browser.
- [x] Every change adds one history entry and Back/Forward walk through them (Landing → Board → Panel → another Panel → close).
- [x] Browser scroll restoration is off from the first paint on a reload, and every Board state starts at the top.
- [x] `userTriggered` no longer exists anywhere in `src/` or `e2e/`. The Board's unfold plays on every Board mount: logo click, direct `/explore`, reload, Back/Forward from the Landing. Reduced motion: instant.
- [x] E2E: `board-look.feature` scenarios "does not unfold on a direct visit" and "does not unfold on Forward from the Landing" now assert the unfold plays; the "reload marker" scenario in `routing.feature` still proves a plain click does not reload the document.
- [x] The production bundle size (gzip, from `pnpm --dir frontend build`) is measured before and after and both numbers are written in the bean's summary and in ADR 0004's Consequences. If the increase is large for a Landing first paint, stop and report it before committing.
- [x] `.claude/rules/frontend.md` and `docs/adr/0004-…` are consistent with the result (no mention of the own route hook as the routing layer); `docs_src/specs/units.md` already describes the new rule.
- [x] `pnpm --dir frontend e2e` run; failures outside this diff are reported by name (7 `board-look` scenarios fail on `main` already: the phone dots, centred titles and "unfold has ended"; 4 remain, the "unfold has ended" ones now pass because the step ignores the endless dot drift).
- [x] `scripts/verify.sh` GREEN

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

## Notes (decisions while building)

- **Where the router lives**: `hooks/useRoute/router.ts` holds `createAppRouter({ shell, landing, board, pages })` (all required): root route (`shell`), `/` (`landing`), a pathless `board` layout route (`board`) with `/explore` and one page route per Panel under it (`pages[panel]`, `staticData: { panel }`), and a `$` catch-all that redirects to `/`. It takes the components as options so the hook chunk imports no page (no cycle); `app/router.ts` (`createSiteRouter`) passes the real ones; `main.ts` renders `RouterProvider`. `App` is only `IntlProvider` plus an `Outlet`; the Board renders an `Outlet` in its Expanded panel. No component switches on the route. `useRoute()` gives `{ board, navigate, link }`, `board` read from the leaf match's `staticData.panel`.
- **Domain type**: the `Route` type (`landing | board`) is gone; `navigate`/`link`/`pathOf` take a `BoardState` (`DEFAULT_BOARD`, `expandedBoard(panel)`), because nothing navigates to the Landing.
- **Test helpers**: `testRouter({ board, pages, … })` (components render nothing unless named; the shell renders its `Outlet`) and `routerWrapper`, exported from the index like `intlWrapper`. The router package is imported only inside `hooks/useRoute`; `main.ts`, `app/` and the tests get `RouterProvider` and `Outlet` from its index.
- **Typing**: `@tanstack/router-core` is a direct dependency pinned to the binding's version, only to augment `StaticDataRouteOption` with `panel`.
- **Tests**: `routerWrapper` (empty router in context) for Panel/Landing; Board, App and the hook render a real tree (`RouterProvider` + `await router.load()` inside `act`), the Board with stub pages.
- **Links**: kept plain `<a href>` with `link(board).onClick` calling `router.navigate`. Stripe/Panel/Board already take `href`/`onClick`, so `Link` would have meant reshaping them for no gain. `links.ts` (`isPlainClick`) stays.
- **Canonical URLs**: an unknown path goes through the `$` catch-all `beforeLoad` redirect (`replace`). A trailing slash is NOT canonicalised by the router (it trims both sides when comparing, and a root `beforeLoad` redirect loops forever), so `createAppRouter` replaces it on the history before the router starts. `caseSensitive: true` so `/Skills` stays unknown. `trailingSlash: "never"` has no effect on this tree and is not set.
- **Scroll**: the router scrolls to the top on every navigation itself (`scrollRestoration: false` keeps it from restoring), so `useScrollReset` is deleted. `history.scrollRestoration = "manual"` is set in `createAppRouter`.
- **Removed**: `store.ts`, `resolvePath`, `routeOfPath`, the `Route` type, `RouteState`/`RouteStore`/`ResolvedPath`, `userTriggered`, `useScrollReset`, `BoardProps`.
- **Test hygiene**: a browser history patches `pushState` and keeps a `popstate` listener until destroyed, so `test-setup.ts` runs `destroyTestRouters` after each test (routers from `testRouter`), and `App.test.ts` destroys the site routers it makes.
- **Lint**: with `erasableSyntaxOnly` gone, `typescript/parameter-properties` is an error in `.oxlintrc.json`. oxlint has no enum rule, and `no-namespace` trips on the existing `declare namespace` in `i18n/types.ts`, so those two are not enforced.
- **Build**: the binding ships TypeScript source. The Oxc loader rule now includes it, and tsconfig dropped `erasableSyntaxOnly` (the binding has a parameter property and tsrs checks it).
- **E2E**: the Board now unfolds on every mount, so measuring scenarios caught Panels mid-flight. Contexts run with reduced motion; scenarios about motion say `Given the visitor accepts motion`. `animating` ignores the endless dot drift, which also fixes the old "unfold has ended" failures. The "Every Board state starts at the top" scroll step retries while the entrance clips the page.
- **Bundle (gzip -9)**: `main.js` 73,112 B before, 127,292 B after (+54,180 B, +74%); `main.css` unchanged 3,194 B. `isbot` and the test helpers (`testRouter`, `routerWrapper`) are not in the bundle. Large for the Landing's first paint: reported to the user before committing, as the criteria say.

## Summary of Changes

- Routing runs on `@octanejs/tanstack-router` (0.3.2, pinned) with code-defined routes: `/` is the Landing, a pathless `board` layout route renders the Board with an `Outlet`, and `/explore` plus one page route per Panel sit under it (`staticData.panel`). `App` is the intl provider and an `Outlet`; nothing switches on the route. `hooks/useRoute` keeps the Panel ids, paths and `BoardState` helpers, the router factory (components passed in) and `useRoute()` (`board`, `navigate`, `link`); `app/router.ts` supplies the real components.
- Removed: the own route store, `resolvePath`/`routeOfPath`, the `Route` type, `userTriggered`, `useScrollReset`, `BoardProps`, `AppProps`. The Board unfolds on every mount.
- Build and tooling: Oxc loader rule includes the binding (it ships TS source); `erasableSyntaxOnly` dropped, `typescript/parameter-properties` lint rule added; `@tanstack/router-core` is a pinned direct dependency for the `staticData` typing.
- Bundle (`main.js`, gzip -9): 73,112 B before, 127,292 B after (+54,180 B, +74%); recorded in ADR 0004.
- E2E: 54 of 58 pass; the 4 failures were already failing on `main` (board-look.feature:20 columns, :100-102 phone dots). Contexts run with reduced motion; motion scenarios opt in.
- Docs: `.claude/rules/frontend.md` (Routing, Toolchain, testing), ADR 0004, the Unit 1 spec (code layout).
