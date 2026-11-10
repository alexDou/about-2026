---
# portfolio-u2li
title: 'Prototype: View Transitions for the Board sequence'
status: todo
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-10T19:15:17Z
updated_at: 2026-11-10T19:15:17Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-t6ex
---

## Parent

portfolio-m9gt (Unit 1: Board). Follows portfolio-t6ex (Board entrance, signals-based motion) and portfolio-1syg (expand and collapse sequences). Design: the Unit 1 section of `docs_src/specs/units.md`.

## What to build

A throwaway prototype that tries React/Octane's `ViewTransition` (the browser's View Transitions API, started per navigation by the router) for the Board's expand, collapse and switch, to decide whether it can replace the staged sequence and the helper functions behind it. The prototype is not merged; the result is a decision with evidence.

What would go if it works (the helpers the owner wants gone):

- `motion/sequence.ts`: `planStages`, `awaitedBy`, `routeChanged`, `transitionEnded`, `advance`, the `awaiting` / `queue` / `stage` state and `isBusy`'s stage part.
- `motion/motion.ts`: `slotResized`, `viewFaded`, `go`, `stage$` and the `Slot`'s `onTransitionEnd` reporting; `useBoardSync`'s route effect.
- `motion/probes.ts`: `isMobile`, `prefersReducedMotion` (CSS media queries instead).
- Possibly the entrance's `titles` bookkeeping, if the entrance can be a plain CSS animation without click blocking.

What stays: the scroll-first step on a Stripe click (`scrollingUpFirst`) before the navigation, the Slot with one stable `<li>` per Panel, the durations as CSS custom properties.

## Questions the prototype must answer

- Looks: does the slot resize read as well as today's live re-flow? Snapshots may stretch the vertical Stripe titles and the Panel text. Try giving each slot (and its title) a `view-transition-name`.
- Choreography: can the desktop open and close (Panels fade out 120ms, widths 500ms ease-in-out, Stripes fade in 400ms with the Expanded panel's content at 150ms) be written as `::view-transition-*` keyframes with delays? Switch is widths only; mobile is one step; reduced motion is none.
- Trigger: how does Octane's `ViewTransition` meet the router (`defaultViewTransition`, the `viewTransition` option of `navigate` and `link`, or a `<ViewTransition>` wrapper)? Is `startTransition` needed?
- Clicks: are clicks on the page ignored while a transition runs (the transition overlay should take them)? What about Escape and the close button? Is any `busy` state still needed?
- Back/Forward during a transition: the browser skips the running one; is that acceptable?
- Support and fallback: Chromium, Safari 18+, Firefox (recent). Without the API the change must still work, instantly.
- Testing: what can unit tests (jsdom has no `startViewTransition`) and E2E (Chromium) check?

## Acceptance criteria

- [ ] A prototype on a scratch branch (or files under the scratchpad), not merged, with the open, close, switch and mobile transitions on the five Panels
- [ ] Frames or a short recording of the prototype next to today's behaviour, desktop 1280x800 and mobile 375x667
- [ ] Each question above answered in the bean, with what was tried
- [ ] A recommendation (adopt, adopt in part, drop) with the list of helpers and tests that go and the ones that stay, and a rough size of the change
- [ ] If adopt: follow-up beans (tests first, constants not hardcoded strings, declarative code only; ask before any imperative code)
- [ ] Nothing changed in the committed Board code or its tests before the decision

## Blocked by

- portfolio-t6ex (Unit 1.7: Board entrance; its motion code is what this would replace)
