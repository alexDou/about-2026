---
# portfolio-vg1p
title: 'Unit 3.0: Skills content contract'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-16T17:20:14Z
parent: portfolio-4rt0
---

## Parent

portfolio-4rt0 (Unit 3: Skills). Design: the Unit 3 section of `docs_src/specs/units.md` (fully decided in the 2026-11-16 grilling). Vocabulary: `CONTEXT.md` (Skill, Skill group, Skill subgroup, Certificate). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The Skills content contract: the content types for Skill group, Skill subgroup, Skill (name, overview, its Certificates) and Certificate (title, issuer, date, optional ranking, optional verification URL, image), the `skills` message area with placeholder content in the agreed group order, and the JSON validation test the later stages build on.

## Acceptance criteria

- [x] Tests written first and red, then green (TDD)
- [x] The seven Skill groups in order: Frontend (subgroup "Architecture & ecosystem"), Backend (subgroup "APIs & architecture"), Databases & search, Cloud & DevOps, Testing & quality, AI, Engineering practice
- [x] A Skill group holds Skills and Skill subgroups, one level deep; groups and subgroups carry no statement
- [x] Every Skill has a name and an overview message; no rating, level or years field
- [x] Certificate ids are unique and each Certificate is used by exactly one Skill
- [x] Placeholder content the test accepts, so stages 3.2 to 3.7 can build before 3.1 lands
- [x] `scripts/verify.sh` GREEN

## Blocked by

- None (can start immediately)

## Summary of Changes

- `pages/skills/content/` (config, types, content, index) holds the contract: Skill group, Skill subgroup, Skill (name, overview, Certificates) and Certificate (title, issuer, date with optional month, optional ranking, optional verification URL, image path). `SKILLS_CONTENT` lists the seven groups in order, with the two subgroups.
- `i18n/en/skills.json` holds placeholder messages (overviews are marked as placeholders until 3.1). The ten decided Certificates sit on their Skills; verification links and image files are left to 3.2.
- `_specs_/content.test.ts` validates messages (all exist, format and are used), group order, one-level depth, Skill shape, unique Certificate ids and one Skill per Certificate. Written first, red, then green.
- Notes for later stages: the Skill list in `config.ts` (`SKILL_IDS`) and the test change together when 3.1 fixes the real lists; the Certificate image extension (`.webp`) is 3.2's to settle.
