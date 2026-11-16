---
# portfolio-vg1p
title: 'Unit 3.0: Skills content contract'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-16T09:50:04Z
parent: portfolio-4rt0
---

## Parent

portfolio-4rt0 (Unit 3: Skills). Design: the Unit 3 section of `docs_src/specs/units.md` (fully decided in the 2026-11-16 grilling). Vocabulary: `CONTEXT.md` (Skill, Skill group, Skill subgroup, Certificate). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The Skills content contract: the content types for Skill group, Skill subgroup, Skill (name, overview, its Certificates) and Certificate (title, issuer, date, optional ranking, optional verification URL, image), the `skills` message area with placeholder content in the agreed group order, and the JSON validation test the later stages build on.

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] The seven Skill groups in order: Frontend (subgroup "Architecture & ecosystem"), Backend (subgroup "APIs & architecture"), Databases & search, Cloud & DevOps, Testing & quality, AI, Engineering practice
- [ ] A Skill group holds Skills and Skill subgroups, one level deep; groups and subgroups carry no statement
- [ ] Every Skill has a name and an overview message; no rating, level or years field
- [ ] Certificate ids are unique and each Certificate is used by exactly one Skill
- [ ] Placeholder content the test accepts, so stages 3.2 to 3.7 can build before 3.1 lands
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- None (can start immediately)
