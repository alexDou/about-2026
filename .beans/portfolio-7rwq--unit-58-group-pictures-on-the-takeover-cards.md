---
# portfolio-7rwq
title: 'Unit 5.8: Group pictures on the Takeover cards'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-24T13:52:15Z
updated_at: 2026-11-24T13:52:15Z
parent: portfolio-349l
blocked_by:
    - portfolio-lo13
    - portfolio-s2ln
---

## Parent

portfolio-349l (Unit 5: What I do). Design: the Unit 5 section of `docs_src/specs/units.md` ("Decided"). Vocabulary: `CONTEXT.md` (Takeover, Takeover group, Benefits). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

Each card's front shows its group's picture (portfolio-s2ln) behind the text, at the opacity settled in the prototype, so it never competes with the group name or the title.

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] Each group's front carries its own picture; the back carries none
- [ ] The pictures live in the card component's `media/`; the test checks each file exists
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-lo13 (Unit 5.6: Takeover cards that flip on hover)
- portfolio-s2ln (Unit 5.1: Takeover group pictures)
