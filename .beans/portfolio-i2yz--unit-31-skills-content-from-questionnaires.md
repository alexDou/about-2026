---
# portfolio-i2yz
title: 'Unit 3.1: Skills content from questionnaires'
status: todo
type: task
tags:
    - ready-for-human
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-16T09:50:04Z
parent: portfolio-4rt0
blocked_by:
    - portfolio-vg1p
---

## Parent

portfolio-4rt0 (Unit 3: Skills). Design: the Unit 3 section of `docs_src/specs/units.md` (fully decided in the 2026-11-16 grilling). Vocabulary: `CONTEXT.md` (Skill, Skill group, Skill subgroup, Certificate). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The real Skills content, written with the Owner: one questionnaire per Skill group in `docs_src/skills/`, grilled with the Owner (their words polished into CV English, nothing invented, answers kept verbatim, no agent draft variants kept), then the message JSON drafted and approved by the Owner.

## Acceptance criteria

- [ ] One questionnaire per Skill group, questions and the Owner's verbatim answers kept
- [ ] Every Skill's overview tells depth in words ("expert", "commercial", "practical"), never as a rating; no years, no demo links, no company mentions
- [ ] Kotlin: learnt and certified, not yet used in commercial work
- [ ] The Skill lists per group fixed with the Owner (the spec's lists are examples)
- [ ] Message JSON approved by the Owner, replacing the placeholders; the 3.0 test passes
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-vg1p
