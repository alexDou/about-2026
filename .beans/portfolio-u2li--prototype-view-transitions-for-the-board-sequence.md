---
# portfolio-u2li
title: 'Prototype: View Transitions for the Board sequence'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-10T19:15:17Z
updated_at: 2026-11-11T10:45:45Z
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

- [x] A prototype on a scratch branch (or files under the scratchpad), not merged, with the open, close, switch and mobile transitions on the five Panels
- [x] Frames or a short recording of the prototype next to today's behaviour, desktop 1280x800 and mobile 375x667
- [x] Each question above answered in the bean, with what was tried
- [x] A recommendation (adopt, adopt in part, drop) with the list of helpers and tests that go and the ones that stay, and a rough size of the change
- [x] If adopt: follow-up beans (tests first, constants not hardcoded strings, declarative code only; ask before any imperative code)
- [x] Nothing changed in the committed Board code or its tests before the decision

## Blocked by

- portfolio-t6ex (Unit 1.7: Board entrance; its motion code is what this would replace)

## Findings (prototype on branch `proto-octane-view_transition`)

### What was tried

1. **Octane `<ViewTransition>` around each slot and view: does not work for navigations.** The router's state reaches components through `useSyncExternalStore`, and Octane's uSES always calls `scheduleUrgentRender` (engine.js), so a route change never commits on the transition lane and no boundary activates (0 transitions in Chromium). React behaves the same way.
2. **Router-core's own View Transition: works.** `createAppRouter` takes `viewTransition` and passes it as `defaultViewTransition`; the router wraps each navigation commit in `document.startViewTransition` and awaits Octane's render. `boardViewTransition.types` gives `open`, `close` + `closing-<panel>`, or `switch` from the from/to URLs (`boardAt`, `changeKind`, `transitionTypes`, unit-tested), `false` to or from the Landing. All motion is CSS in the Slot's stylesheet: static `view-transition-name`s per tone (`slot-*`, `view-*`), `view-transition-class` `vtSlot`/`vtView`/`vtExpanded`, and `:root:active-view-transition-type(...)::view-transition-*` rules. No imperative app code.

### Answers

- **Looks.** The slot's colour box is its own snapshot (the view is cut out), stretched to the group, so a resize reads like today's. Views keep natural size: on desktop they are clipped at the sides only, Stripe titles anchored left, the Expanded page centred (its heading stays centred; the close button shows only near the end of a switch, today it rides along). Mid-switch the page does not re-flow, it is cropped.
- **Seam (Chromium).** A Stripe (constant size, transform-only group) moves on the compositor, a resizing slot on the main thread: video frames showed a Stripe-wide gap of page background for most of a switch. Fixed by extending each slot's colour box `6rem` to the right under its neighbour (`::view-transition-new(.vtSlot)`); the moving Stripe then briefly looks wider. Mobile showed no seam.
- **Choreography.** Measured with `getAnimations()`: open = Panels out 0+120, groups 120+500, Stripes in 620+400, page in 620+150; close = Stripes out 0+400, page out 0+150 (`closing-<panel>`), groups 400+500, Panels in 900+120; switch and all of mobile = groups 0+500, views swap. Same as today.
- **CSS Modules.** rspack hashes class selectors inside `::view-transition-*()` but not `view-transition-class` values; `:global(.vtSlot)` inside the pseudo argument keeps them matching. Types and names are not hashed. All View Transition CSS must sit in one module (the Slot's).
- **Trigger.** `defaultViewTransition: { types }` on the router; no `startTransition`, no `<ViewTransition>`, no previous-board state. `:active-view-transition-type` needs Chrome 125+ / Safari 18.2+; without it the router starts an untyped transition and the base CSS (sizes only) plays.
- **Clicks.** The `::view-transition` overlay takes mouse clicks (a click mid-open did nothing). The keyboard is not blocked: Escape mid-open skips the open and plays a close (today: ignored). A `busy` guard for the close button/Escape (or accepting it, like Back) is the open decision.
- **Back/Forward mid-transition.** The running transition is skipped (ends at once), the new one plays from where the DOM is. Acceptable.
- **Reduced motion.** CSS `animation: none` on every pseudo: each change is a ~40ms transition with no motion.
- **Fallback.** Without `document.startViewTransition` router-core just runs the update: the change is instant.
- **Testing.** jsdom has no `startViewTransition`, so unit tests cover `transitionTypes`/`boardAt` and that the Board rests on the route at once. E2E (Chromium, reduced motion) still passes 56/60; the 4 failing `board-look.feature` scenarios fail the same on today's build. Motion checks need Chromium with motion on: `getAnimations()` timings per pseudo-element, or frames frozen at a `currentTime`.

### Tests and code the prototype removed

21 unit tests of the staged sequence (`BoardSequence.test.ts` 10, `Slot.test.ts` 3, `sequence.test.ts` 8): stage order, `transitionend` reporting, busy while a stage runs, Back mid-sequence. `Slot/utils.ts` (`endedOn`) and `RESIZE_PROPERTY`/`FADE_PROPERTY` are gone; `routeChanged` no longer plans stages. Still in place but dead: `planStages`, `awaitedBy`, `advance`, `transitionEnded`, `slotResized`, `viewFaded`, `isMobile`, `stage$`.

### White blink (owner's recording, `support_files/screen-capts/Screencast_20261111_055322.webm`)

- Seen in the owner's Brave 153 (native Wayland, display scale 1.05/1.1, AMD GPU): on every close, and on some opens, the old view snapshots came up as blank white boxes and faded over their own fade time (page ~150ms, Stripes ~400ms). The colour boxes and the new views rendered fine. Switch and all of mobile, which never show an old view, did not blink.
- Not reproduced: headless Chromium 150 and Brave 153 (software, GPU flags, emulated scale 1.1), and a Brave window opened by Playwright through XWayland at scale 1, which the owner watched and found smooth. So the cause is one of: native Wayland with a fractional scale, the dev server build, or the owner's profile. Not isolated.
- First attempt, no effect for the owner: hiding snapshots with `opacity: 0` instead of `display: none`.
- Change applied, **not confirmed by the owner yet**: on desktop the old views are never shown, as on mobile. The `closing-<panel>` type, the fade-out keyframes and the group delays are gone.

### Update to the answers above

- **Choreography now:** open = groups 0+500, Stripes in 500+400, page in 500+150; close = groups 0+500, Panels in 500+120; switch and mobile = groups 0+500. The old views go at once: no fade-out of the Panels on open, nor of the Stripes and the page on close. This is no longer the same as today.
- **Names:** the `view-transition-class` values are now `slot`, `slot__view`, `slot__view--expanded` (portfolio-b4cl), not `vtSlot`/`vtView`/`vtExpanded`. Types are `open`, `close`, `switch`.
- **Note for frozen frames:** headless screenshots of paused view-transition animations are stale; measure with computed styles and real-time recordings.

## Recommendation: adopt in part, after the owner's check

Adopt the router-driven View Transition for the resize and the fade-in of the new views, if the blink is gone in the owner's browser. Otherwise drop it: a transition that paints white boxes in the owner's own browser cannot ship.

- **Goes** (about 350 lines of code and 21 + ~25 tests): `planStages`, `awaitedBy`, `advance`, `transitionEnded`, the `queue`/`awaiting`/`stage` state, `slotResized`, `viewFaded`, `stage$`, the Slot's `onTransitionEnd` reporting and `shown`, `isMobile`/`prefersReducedMotion` for the sequence.
- **Stays:** the entrance and its `titles` bookkeeping with `busy$`, the scroll-first step on a Stripe click, the Slot with one `<li>` per Panel, the `--seq-*` durations.
- **Comes** (about 60 lines of TS, 110 of CSS, 9 tests): `boardAt`, `changeKind`, `transitionTypes`, `boardViewTransition`, the router's `viewTransition` option, the View Transition rules in the Slot's stylesheet.
- **Costs to accept:** no fade-out of the old views; the page is cropped, not re-flowed, during a resize; the 6rem colour-box overlap that hides Chromium's seam; Escape is not blocked mid-transition; motion can only be tested in a real browser.
- Follow-up: portfolio-2dsc (draft, blocked on the owner's check).

## Summary of Changes

On branch `proto-octane-view_transition`, uncommitted, not merged: the router starts a typed View Transition per Board navigation (`hooks/useRoute`, `app/router.ts`, Board `utils.ts`/`config.ts`/`types.ts`), all motion is CSS in `Slot/styles.module.css`, the Board rests on the route at once (`Board.tsrx`, `motion/sequence.ts`), and the staged-sequence tests were removed. Code review (standards and spec) ran on the diff; its findings on the prototype were applied (unused closing type, stale comments, an unused class). `scripts/verify.sh` GREEN; E2E last run 56/60 before the final blink change, with the same 4 `board-look.feature` failures as today's build.
