---
# portfolio-mla2
title: 'Unit 5.9: Shuffle'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-24T13:52:15Z
updated_at: 2026-11-24T13:52:15Z
parent: portfolio-349l
blocked_by:
    - portfolio-rg5l
    - portfolio-xnrf
---

## Parent

portfolio-349l (Unit 5: What I do). Design: the Unit 5 section of `docs_src/specs/units.md` ("Decided"). Vocabulary: `CONTEXT.md` (Takeover, Takeover group, Benefits). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

Shuffle, on the left of the control row, deals a new random order and releases every held card. The cards move to their new places with View Transitions (a call that starts one, beside the router's route transitions); where the browser lacks them, and under reduced motion, they reappear in the new order at once.

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] Shuffle changes the order and every card shows its front afterwards
- [ ] The move is animated where View Transitions exist; instant otherwise and under reduced motion
- [ ] "Shuffle" comes from the messages
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-rg5l (Unit 5.5: Copy takeovers)
- portfolio-xnrf (Unit 5.7: Holding a Takeover card open)
