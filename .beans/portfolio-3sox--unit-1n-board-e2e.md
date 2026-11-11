---
# portfolio-3sox
title: 'Unit 1.N: Board E2E'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-11T17:58:05Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-1syg
    - portfolio-t6ex
    - portfolio-402i
    - portfolio-2r8j
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

Cucumber + Playwright scenarios against the production build prove the Unit 1 flows end to end (Stage Final).

## Acceptance criteria

- [x] Each of the seven URLs renders the right state on a direct visit.
- [x] Back/Forward walk through Landing → Board → Panel → another Panel → close.
- [x] An unknown path lands on `/`; a trailing slash is dropped.
- [x] The entrance runs whenever the Board appears: after the logo click, on a direct `/explore` visit, after a reload.
- [x] Expanding from a Stripe works; the close button and Escape restore the default Board.
- [x] On a mobile viewport the Panels are rows and the Stripes are title-height rows.
- [x] With the backend unreachable, Chat with me and Contact show the offline note.
- [x] With reduced motion emulated, state changes render instantly.
- [x] With motion on, open, close and switch run as View Transitions: the transition types and the animation timings per pseudo-element (moved from portfolio-2dsc).
- [x] `pnpm --dir frontend e2e` green
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-1syg (Unit 1.6: Expand and collapse sequences)
- portfolio-t6ex (Unit 1.7: Board entrance)
- portfolio-402i (Unit 1.8: Backend status in Chat with me and Contact)


## Notes

- New: `motion.feature` (+ `motion.steps.ts`) records every View Transition the router starts (an init script wraps `document.startViewTransition`) and, once `ready`, every animation on its pseudo-elements: types `open`/`switch`/`close`; groups 500ms ease-in-out; desktop open fades Stripes 400ms and the Expanded panel 150ms after 500ms, close fades Panels 120ms after 500ms; switch and all of mobile only resize; old views at opacity 0; reduced motion: no animations; none to or from the Landing.
- New: `offline.feature` stubs `/api/**` (abort or `{status: ok}`) with `page.route`; the static E2E server has no backend.
- Added: direct visit to `/`, the full Back/Forward walk (routing), the entrance after a reload (board-look), the default Board after Escape and the mobile Stripe height `max(44px, 1lh + 1.5rem)` (panels).
- `the unfold has ended` now waits for the Board first: the route renders after `load`, so the poll could pass before the entrance began and the next click fell into it (seen as flaky motion scenarios).
- `pnpm e2e`: 71/75. The 4 failures are the pre-existing `board-look.feature` ones (portfolio-2dsc saw them before this bean); moved to portfolio-2r8j, which blocks the last checklist item.
- Root group (`::view-transition-group(root)`) keeps the UA's 250ms animation; it is not asserted (identical geometry, nothing visible).


## Summary of Changes

Built in eecc459: `motion.feature` (View Transition types and per-pseudo-element timings, with motion on and reduced), `offline.feature` (the offline note with `/api` stubbed), the full Back/Forward walk, a direct visit to `/`, the entrance after a reload, the default Board after Escape and the mobile Stripe height; `the unfold has ended` waits for the Board first. The last item, `pnpm e2e` green, came with portfolio-2r8j (75/75).
