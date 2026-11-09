---
# portfolio-1syg
title: 'Unit 1.6: Expand and collapse sequences'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-09T10:30:50Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-4zpt
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

Board state changes caused by a user action animate as designed; every other change renders at once. Desktop runs the fade and width sequence, mobile the simpler shrink and expand. Switching from a scrolled page first scrolls smoothly to the top.

## Acceptance criteria

- [ ] Unit and integration tests written first and red, then green (TDD, per the rules). The sequencing logic (step order, scroll skipped at the top, clicks ignored mid-sequence, cancel on Back/Forward, reduced motion) is tested without depending on real timers.
- [ ] One stable slot per Panel; only the slot's size animates, and the Panel, Stripe and Expanded panel views fade into each other inside it.
- [ ] Desktop opening: the other Panels' content fades out (120ms), the widths animate (500ms, ease-in-out), then the Stripes fade in (400ms) while the Expanded panel's content fades in (150ms). Closing runs the same steps backwards.
- [ ] Desktop switching: smooth scroll to the top (skipped when already there; the next step waits for the scroll to end), then close, then open.
- [ ] Mobile: no fade-out and no closing step. The other rows shrink to Stripes and the chosen one expands; switching scrolls smoothly to the top first.
- [ ] CSS only: the durations are CSS custom properties kept in one place, and the steps chain on `transitionend`.
- [ ] Clicks are ignored while a sequence runs. Back/Forward or a direct visit during a sequence drops it and renders the target state.
- [ ] Only user-triggered route changes animate (the flag from Unit 1.3).
- [ ] With reduced motion, every step is instant.
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-4zpt (Unit 1.5: Open and close a Panel)
