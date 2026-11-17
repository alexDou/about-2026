---
# portfolio-3q18
title: 'Unit 3.4: Skill groups'
status: todo
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-17T14:05:42Z
parent: portfolio-4rt0
blocked_by:
    - portfolio-vg1p
---

## Parent

portfolio-4rt0 (Unit 3: Skills). Design: the Unit 3 section of `docs_src/specs/units.md` (fully decided in the 2026-11-16 grilling). Vocabulary: `CONTEXT.md` (Skill, Skill group, Skill subgroup, Certificate). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The Skills Panel's groups: opening `/skills` shows the "Skills" heading, the header row (room for Expand all on the left and Copy skills on the right), and the Skill group blocks, centred with a max-width on desktop and full width minus the side padding on phones. Each block is filled with the light `#d1dcd9` with `#25363a` text and shows the group name, its Skills and its subgroups.

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] Default view: every group and subgroup shows its Skill names; every overview hidden
- [ ] A Skill's filled arrow is its only toggle: a button padded to a 24px target or more, with an accessible name; the Skill's name stays plain, selectable text
- [ ] Group and subgroup headings keep a state of their own, closed by default; a click flips it and sets all their Skills to match (open all / close all); a heading acts on its own group or subgroup only
- [ ] Opening or closing Skills by hand leaves a heading's state alone, except: all closed by hand → closed; all opened by hand → open (so the next heading click always does something visible)
- [ ] The heading rule lives in pure functions with their own unit tests
- [ ] All text from the `skills` messages
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-vg1p

## Notes

- From 3.1 (2026-11-17): groups can hold several subgroups (Databases & search has three: SQL, NoSQL, ORMs & drivers) and no Skills of their own; Backend and AI also have one subgroup each. The spec says "a heading acts on its own group or subgroup only" and "sets all their Skills": decide with the Owner whether a group heading over subgroups only (Databases) opens the subgroups' Skills or does nothing.
