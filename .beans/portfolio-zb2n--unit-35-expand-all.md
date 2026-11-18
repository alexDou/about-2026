---
# portfolio-zb2n
title: 'Unit 3.5: Expand all'
status: todo
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-18T14:54:21Z
parent: portfolio-4rt0
blocked_by:
    - portfolio-r41n
    - portfolio-3q18
---

## Parent

portfolio-4rt0 (Unit 3: Skills). Design: the Unit 3 section of `docs_src/specs/units.md` (fully decided in the 2026-11-16 grilling). Vocabulary: `CONTEXT.md` (Skill, Skill group, Skill subgroup, Certificate). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

Expand all: the walking toggle in the header row, labelled "Expand all", as a convenience switch over every Skill's overview.

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] Off by default; on opens every overview, off closes every overview
- [ ] It keeps the position the Visitor gave it and never follows the Skills: opening everything by hand leaves it off; closing some by hand leaves it on
- [ ] The group and subgroup headings' states follow by the heading rule after Expand all acts
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-r41n
- portfolio-3q18

## Notes

- From the walking toggle (2026-11-18): the toggle reports a change only when its walk (or reduced-motion slide) has ended; Expand all opens or closes the overviews then, not on click. The toggle has no visible label: "Expand all" is its accessible name and its hover hint.

- The toggle's two labels (2026-11-18): `WalkingToggle` takes `labels: { off, on }`; pass "Expand all" and "Collapse all" from new `skills` messages (every text on the site comes from the messages; the skills content test wants every `skills.*` message used, so add them with the code that reads them).
