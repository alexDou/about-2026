---
# portfolio-1syg
title: 'Unit 1.6: Expand and collapse sequences'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-10T15:21:49Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-4zpt
    - portfolio-8o1w
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

Every Board state change animates as designed, whatever caused it (click, direct visit, reload, Back/Forward). The site tracks neither the cause nor what was open before (ADR 0004). Desktop runs the fade and width sequence, mobile the simpler shrink and expand. Switching from a scrolled page first scrolls smoothly to the top.

## Acceptance criteria

- [x] Unit and integration tests written first and red, then green (TDD, per the rules). The sequencing logic (step order, scroll skipped at the top, clicks ignored mid-sequence, drop on Back/Forward, reduced motion) is tested without depending on real timers.
- [x] One stable slot per Panel; only the slot's size animates, and the Panel, Stripe and Expanded panel views fade into each other inside it.
- [x] Desktop opening: the other Panels' content fades out (120ms), the widths animate (500ms, ease-in-out), then the Stripes fade in (400ms) while the Expanded panel's content fades in (150ms). Closing runs the same steps backwards.
- [x] Desktop switching: smooth scroll to the top (skipped when already there; the next step waits for the scroll to end), then one step like mobile (revised after a visual check: no fade-out and fade-in between two Expanded panels, only the widths animate).
- [x] Mobile: no fade-out and no closing step. The other rows shrink to Stripes and the chosen one expands; switching scrolls smoothly to the top first.
- [x] CSS only: the durations are CSS custom properties kept in one place, and the steps chain on `transitionend`.
- [x] Clicks are ignored while a sequence runs. A Back/Forward during a sequence drops it; decide here what the new state plays, without tracking the cause of the change or what was open before.
- [x] Every route change animates the same way; there is no `userTriggered` flag (removed by the router bean).
- [x] With reduced motion, every step is instant.
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-4zpt (Unit 1.5: Open and close a Panel)
- portfolio-8o1w (Move routing to @octanejs/tanstack-router)

## Decisions

- Stages, not timers: the Board is a tree of stages (`useBoardMotion/sequence.ts`, pure planner and state functions). Desktop open = Panels fade out, slots resize, Stripes and page fade in; close backwards; switch = scroll to top (if scrolled), then one step with the views kept and only the widths animating (like mobile; a first version closed and reopened, which a visual check showed as a redundant fade). Mobile plays the target stage in one step.
- Back/Forward (any route change) mid-sequence: the stages still to play are dropped and the planner walks from the stage on screen to the new route's stage. No cause tracking, no memory of what was open.
- A direct visit/reload of an Expanded panel shows it at once (the Board entrance still plays); only route changes while the Board is mounted play stages.
- A stage ends when the slots and views it changes have each reported `transitionend` (`onTransitionEnd` on the Slot, by Panel); the planner knows which (`awaitedBy`) and skips a stage that changes none. Reduced motion skips every stage. (First version asked the browser with `getAnimations()`; replaced after the rule "declarative React, state in context/signals", see portfolio-t6ex.) The scroll-to-top wait is a rAF check for a page that stops moving.
- Panel, Stripe and Expanded panel no longer own the `<li>` or the tone; `Slot` does. Panel and Stripe take `href`/`onClick` (Board wraps them in `ignoredWhileBusy`).

## Known limitation (follow-up)

The route's `Outlet` swaps the page at once, so on close and on switch the outgoing Expanded panel fades out without its page (or, when switching, showing the new page). Fine for heading-only pages; once real content lands a unit should keep the outgoing page for the fade-out.

## Summary of Changes

- New `Slot` (one stable `<li>` per Panel, only its size transitions; view wrapper fades, `inert` when hidden) and the Board's motion (a module of signals in `hooks/useBoardMotion/`, planner and state functions in `sequence.ts`; reworked in portfolio-t6ex from a DOM-reading hook to signals).
- Board renders slots from the stage; clicks, close button and Escape are ignored while busy; `useBoardFocus` follows the resting stage; `usePrevious` removed.
- `--seq-*` durations in `tokens.css`; sizes animate via `flex-grow`/`flex-basis`.
- Tests: sequence planner/reducer, probes, Board sequence integration (faked transitions), Slot; Panel/Stripe/ExpandedPanel tests adapted. Docs: `units.md` Motion, `.claude/rules/frontend.md`.
- E2E suite at baseline (4 pre-existing failures, unchanged); checked the real sequence by hand in Chromium (desktop and 375px).


## Review follow-ups (not fixed here)

- Direct visit/reload of an Expanded panel shows it at once (no stages); `units.md` says so. Say if you want the open sequence to play on mount instead.
- Mobile views swap instantly while the slot resizes (single stage), no cross-fade: the "simpler shrink and expand".
- Focus is not restored when Back interrupts an open that never rested on another Panel (the activated link went `inert`).
- Closing from a scrolled tall page snaps the Board height when the page view unmounts; only switching scrolls to the top first. Matters once pages are tall.
- A click during the entrance unfold ended `.entering` at the resize stage and snapped the unfold. Fixed in portfolio-t6ex: the Board ignores clicks until the entrance ends.
- No E2E scenario for the sequence yet (Unit 1.N).
