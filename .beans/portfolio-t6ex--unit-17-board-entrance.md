---
# portfolio-t6ex
title: 'Unit 1.7: Board entrance'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-09T10:30:50Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-uqsd
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

The Landing logo click reveals the Board with the pen's entrance. Any other way of reaching the Board (a direct visit, a reload, Back/Forward) shows it at once.

## Acceptance criteria

- [ ] Unit and integration tests written first and red, then green (TDD, per the rules)
- [ ] The entrance runs only for the user-triggered Landing → `/explore` change, not on a direct `/explore` visit, a reload or Back/Forward.
- [ ] As in the pen: the Board slides in (300ms), the Panels follow 150ms apart with the perspective entrance, then the titles fade in (140ms). The durations are CSS custom properties in the Board's stylesheet.
- [ ] Clicks are ignored until the entrance ends.
- [ ] With reduced motion, the entrance is skipped.
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-uqsd (Unit 1.4: Default Board look)
