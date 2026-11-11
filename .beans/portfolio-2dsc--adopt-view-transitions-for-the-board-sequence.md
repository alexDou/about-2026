---
# portfolio-2dsc
title: Adopt View Transitions for the Board sequence
status: in-progress
type: task
priority: normal
tags:
    - needs-info
created_at: 2026-11-11T10:45:26Z
updated_at: 2026-11-11T10:55:47Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-u2li
---

## Parent

portfolio-m9gt (Unit 1: Board). Follows the prototype portfolio-u2li (branch `proto-octane-view_transition`); its Findings and Recommendation are the design.

## Blocked on the owner

- The white blink in the owner's Brave (native Wayland, display scale 1.05/1.1) must be confirmed gone with the prototype's last change (old views never shown). If it is not, this bean is scrapped.
- Decide: accept that the old views go at once (no fade-out of the Panels on open, of the Stripes and the page on close), and that Escape is not blocked during a transition.

## What to build

Move the prototype into the Board for real, tests first:

- Keep: `boardAt`, `changeKind`, `transitionTypes`, `boardViewTransition`, the `viewTransition` option of `createAppRouter`, the View Transition rules in the Slot's stylesheet.
- Remove the staged sequence that the prototype left dead: `planStages`, `awaitedBy`, `advance`, `transitionEnded`, the `queue`/`awaiting`/`stage` state, `slotResized`, `viewFaded`, `stage$`, the `mobile`/`reducedMotion` surroundings of `routeChanged`, `SlotProps.shown` and `slot__view--hidden`, and their tests.
- Keep the entrance, the scroll-first step on a Stripe click and `busy$` for those two.
- Rewrite "The Board's motion" in `.claude/rules/frontend.md`.
- E2E with motion on: the transition types and the animation timings per pseudo-element.

## Acceptance criteria

- [x] Owner confirmed: no blink in their browser
- [x] Unit tests first for what stays; the dead sequence code and its tests removed
- [x] Constants, not hardcoded strings; declarative code only (ask before any imperative code)
- [x] `.claude/rules/frontend.md` describes the new motion
- [ ] E2E scenario for open, close and switch with motion on
- [x] `scripts/verify.sh` GREEN

## Notes

- The owner decided to adopt (2026-11-11) and asked for the clean-up of the old helpers.
- Removed: `planStages`, `awaitedBy`, `advance`, `transitionEnded`, `settledStage`, the `stage`/`queue`/`awaiting` state, `stage$`, `slotResized`, `viewFaded`, `isMobile`, `Surroundings`, `BoardStage`, `STAGE_VIEWS`, `SlotProps.shown`, `slot__view--hidden`, the unused `closing-<panel>` type, and their tests. `motion/sequence.ts` is now `motion/state.ts` (entrance and scroll only); `go(board, reducedMotion)`. The Board renders from the route; `useBoardFocus` takes the Expanded panel.
- `BoardSequence.test.ts` is now `BoardNavigation.test.ts`. E2E 56/60, the same 4 `board-look.feature` failures as before the change.
- The owner confirmed the blink is gone (2026-11-11). Still open: an E2E scenario with motion on.
