---
# portfolio-rg5l
title: 'Unit 5.5: Copy takeovers'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-24T13:52:15Z
updated_at: 2026-11-24T13:52:15Z
parent: portfolio-349l
blocked_by:
    - portfolio-ytti
---

## Parent

portfolio-349l (Unit 5: What I do). Design: the Unit 5 section of `docs_src/specs/units.md` ("Decided"). Vocabulary: `CONTEXT.md` (Takeover, Takeover group, Benefits). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The control row above the cards with Copy takeovers on the right (the left is kept for Shuffle), as on Skills. A click copies every Takeover as plain text, two spaces per level: group, title, description and a "Benefits:" line where there are Benefits; groups in copy order, cards in the order of the message file. The button shows "Copied" for a moment. It uses the global clipboard hook.

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] The copied text matches the format above, whatever order the cards are in on screen
- [ ] "Copy takeovers" and "Copied" come from the messages
- [ ] A refused clipboard shows no "Copied"
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-ytti (Unit 5.2: Takeover content contract)
