---
# portfolio-t6ex
title: 'Unit 1.7: Board entrance'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-10T16:48:20Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-uqsd
    - portfolio-8o1w
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

The Board appears with the pen's entrance whenever it mounts: the Landing logo click, a direct visit, a reload, Back/Forward from the Landing (ADR 0004). The site does not tell these apart.

## Acceptance criteria

- [x] Unit and integration tests written first and red, then green (TDD, per the rules)
- [x] The entrance runs on every mount of the Board (logo click, direct `/explore` visit, reload, Back/Forward from the Landing).
- [x] As in the pen: the Board slides in (300ms), the Panels follow 150ms apart with the perspective entrance, then the titles fade in (140ms). The durations are `--enter-*` CSS custom properties, kept with the other motion tokens in `styles/tokens.css` (decided: one place for all motion durations, as for 1.6).
- [x] Clicks are ignored until the entrance ends.
- [x] With reduced motion, the entrance is skipped.
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-uqsd (Unit 1.4: Default Board look)
- portfolio-8o1w (Move routing to @octanejs/tanstack-router)

## Summary of Changes

- The entrance itself (slide-in, perspective unfold, title fade, every mount, reduced motion skips it) was already in place from 1.2/1.4/1.6, with E2E scenarios for the logo click, a direct visit, Forward and reduced motion. Only the click blocking was missing.
- First version: a hook that listened to `animationend` and asked `getAnimations()`. Rejected as imperative; reworked together with the 1.6 sequence (see "Decisions").
- Final: the Board's motion is a module of signals (`components/domain/Board/motion/motion.ts`: one scope, one state signal, derived `stage$` / `busy$` / `entering$` / `scroll$`, plain action functions; rules in the pure `sequence.ts`). Slot and Panel import it directly. The route decides what shows at rest, so a mount at any URL shows its stage at once; the motion resets when the Board unmounts. Each Panel reports `onAnimationEnd` of its title; the entrance plays until all five have. The Board is `busy` while it or a sequence runs, so Panel and Stripe links, the close button and Escape are ignored; a modified click still passes. A direct visit to an Expanded panel has no unfold, so nothing blocks it.
- The same motion now drives the 1.6 stages: slots and views report `transitionend` (`onTransitionEnd` on the Slot), no `getAnimations`, no `data-seq`, no element listeners. The route reaches the motion in an effect, one frame after it changes; the page shows only in the slot the route names. Reduced motion skips every stage and the entrance.
- Tests first and red: pure state functions (`sequence.test.ts`), Slot and Panel unit tests that start the module state through `go` and assert on it (reports, entering class), `BoardEntrance.test.ts`, `BoardSequence.test.ts` (events fired by hand), E2E "Clicks are ignored until the unfold ends". Mutation-checked red with the entrance left out of `busy`.
- Durations stay in `styles/tokens.css` (`--enter-*`, `--seq-*`), not the Board stylesheet; the criterion was reworded.
- Constants: `BOARD_KIND`, `STAGE_VIEWS`, `SLOT_VIEWS`, `API_HEALTH`, `STATUS_TONES`, `SEGMENT_TYPES`, named DOM selectors; rule "No hardcoded values" in `frontend.md`.
- Docs: Motion section of `units.md`; `frontend.md` gets "Declarative, conventional React", "Shared state: signals", "No hardcoded values" and "The Board's motion".

## Decisions

- Signals, not Zustand (tried first): both fit; the user preferred signals for state tracking. Measured: a `derived$` re-renders its readers on any input change, so it is not a render filter; irrelevant at five small components.
- Module level, not per-mount context (tried first, with `useSignal$` in a hook): there is one Board per document, so direct imports are simpler and tests set the signals through the module. The route is the source of truth at rest, so nothing needs to know the route at import time.
- `go` runs in a passive effect: a signal cannot be written while a component commits. Cost: the stage lags the route by a frame. An E2E step that pressed Escape right after a click now waits for the page first.
- Still imperative, kept until agreed (rule: ask first): `scrollToTop` (rAF loop), `useBoardFocus` (`.focus()`), `useEscapeKey`, `useThemeColor`, `useDocumentTitle`, `scrollRestoration`, `AnimatedLogo` drawing and `useAnimationFrame`.

## Review follow-ups (code-reviewer, then fixed)

- Switch from a scrolled page: the route change removed the old page before the effect read `scrollY`, so the browser clamped the scroll and the smooth scroll never played. Now a Stripe click scrolls up first and navigates when the page has (`scrollingUpFirst`); the scroll stage, `pageScrolled`, `scrolling$` and the scroll effect are gone. New E2E scenario checks the page is still scrolled right after the click.
- Derived what could be derived: no `goal` (the target is where the queue ends; `stage: null` means not started) and no `step`.
- `titleShown` returns the same state for a title nobody waits for; `expandedBoard` gives one object per Panel; the motion lives in `Board/motion/` (it holds no hook); tests use the folder's index.
- Not changed: `transitioncancel` is not counted as an end (a Back mid-sequence cancels the dropped stage's transitions, which would end the next stage at once), so a stage whose transition is cancelled with no route change (reduced motion switched on mid-sequence) leaves the Board busy until Back or Forward. A stale `transitionend` can end the next stage early after a Back mid-sequence; cosmetic.

## Known issues

- E2E: board-look.feature:20, :100-102 fail as before this unit; "Mobile shows equal-height rows" (:39) flakes now and then because its step reads `locator.all()` without waiting for the Board to mount.
