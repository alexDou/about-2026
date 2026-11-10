---
# portfolio-3n34
title: 'Unit 1.3: Landing ↔ Board routing'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-10T06:38:52Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-lz1t
    - portfolio-u8a6
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

URLs drive the site. Clicking the Landing logo opens `/explore` with a history entry, browser Back returns to the Landing, and a direct visit to `/explore` shows the Board. For now the Board lists the five Panel titles from messages as plain links. Unknown paths and trailing slashes are corrected without a history entry. Every route change records whether a user action caused it, for the animation tickets.

## Acceptance criteria

- [x] Unit and integration tests written first and red, then green (TDD, per the rules)
- [x] Our own route hook over the History API (no router package), built on the Unit 1.0 mapping and shared by App, Board and Landing.
- [x] Logo click → `/explore` as a new history entry; Back → Landing; Forward → Board.
- [x] A direct visit to `/explore` renders the Board; an unknown path is replaced by `/`; `/explore/` is replaced by `/explore`.
- [x] The Board renders the five Panel titles in order as links to their URLs. A plain click is handled in the app without a reload; modifier and middle clicks keep browser behaviour (new tab). A Panel URL renders the Board for now; opening a Panel comes with Unit 1.5.
- [x] A route change caused by a click is marked as user-triggered; the initial load and Back/Forward are not.
- [x] The logo E2E scenario "Clicking the logo logs a message" becomes "Clicking the logo opens the Board"; `pnpm --dir frontend e2e` stays green.
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-lz1t (Unit 1.0: Board and message contracts)
- portfolio-u8a6 (Unit 1.2: FormatJS on the Landing)

## Summary of Changes

- `useRoute` (hooks/useRoute): own route store over the History API (`store.ts`), read lazily with non-canonical URLs (unknown path, trailing slash) replaced without a history entry. `useRoute()` gives `{ route, userTriggered, navigate, link }` through `useSyncExternalStore`, shared by App, Board and Landing. `link(route)` returns `{ href, onClick }`; `isPlainClick` (`links.ts`) leaves modifier, middle and right clicks to the browser. Added `BOARD_ROUTE` and `panelRoute` beside `pathOf`/`resolvePath`.
- `userTriggered` is true only for `navigate()` (logo and link clicks); initial load and Back/Forward are false. A Back/Forward that keeps the path (a #hash step) keeps the snapshot and notifies nobody.
- `components/domain/Board/`: the five Panel titles from messages as links in order. Minimal layout only; the Panel/Stripe/Expanded panel come with the next units.
- `App` renders `LandingPage` on `/` and `Board` otherwise; the logo click calls `navigate(BOARD_ROUTE)` (the placeholder `console.log` is gone).
- Tests: store, links, hook, Board, Landing and App unit tests; E2E `routing.feature` and the logo scenario now reads \"Clicking the logo opens the Board\". Dropped the now-unused console capture from the E2E world.

## Decisions

- Store snapshot re-reads the address bar while nobody is subscribed, so a popstate between the first render and the subscribe is not missed.
- Panel URLs render the default Board for now (Unit 1.5 opens a Panel).
