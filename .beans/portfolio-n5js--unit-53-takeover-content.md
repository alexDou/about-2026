---
# portfolio-n5js
title: 'Unit 5.3: Takeover content'
status: todo
type: task
tags:
    - ready-for-human
created_at: 2026-11-24T13:52:15Z
updated_at: 2026-11-24T13:52:15Z
parent: portfolio-349l
blocked_by:
    - portfolio-ytti
---

## Parent

portfolio-349l (Unit 5: What I do). Design: the Unit 5 section of `docs_src/specs/units.md` ("Decided"). Vocabulary: `CONTEXT.md` (Takeover, Takeover group, Benefits). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The real Takeovers in the message file: the agreed list, every card's title, description and Benefits approved by the Owner. Drafts are shown in the session; only approved text is committed.

## Acceptance criteria

- [ ] Every Takeover's text approved by the Owner before it lands in the file
- [ ] No placeholder left; the 5.2 test passes
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-ytti (Unit 5.2: Takeover content contract)
