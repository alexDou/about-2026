---
# portfolio-xnrf
title: 'Unit 5.7: Holding a Takeover card open'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-24T13:52:15Z
updated_at: 2026-11-24T13:52:15Z
parent: portfolio-349l
blocked_by:
    - portfolio-lo13
---

## Parent

portfolio-349l (Unit 5: What I do). Design: the Unit 5 section of `docs_src/specs/units.md` ("Decided"). Vocabulary: `CONTEXT.md` (Takeover, Takeover group, Benefits). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

A card can be held with its back up. Desktop: the back's top-right pin holds the card and turns into a crossed-out pin; the unpin flips it back; any other mouse click on the card does nothing. Keyboard: the front is a button reached with Tab (the role goes while the card is held); Enter flips and holds it and focus moves to the unpin button (a `focus()` call); Escape on a focused held card, or the unpin, flips it back and focus returns to the front, while the Expanded panel stays open; Escape anywhere else closes the panel as before. Touch: the front shows "See details" in italics at the bottom; a tap on the front flips and holds the card; the pin is hidden and only the unpin flips it back; other taps on the back do nothing. Several cards can be held at once.

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] Pin and unpin icons with accessible names from the messages
- [ ] Enter, Escape and the focus moves as above; the panel closes on Escape only when no held card has focus
- [ ] A mouse click and a tap are told apart (the click's pointer type), checked in Chromium, Firefox and Safari
- [ ] "See details" shows on touch screens only
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-lo13 (Unit 5.6: Takeover cards that flip on hover)
