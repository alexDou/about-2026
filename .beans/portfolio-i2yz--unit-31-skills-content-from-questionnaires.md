---
# portfolio-i2yz
title: 'Unit 3.1: Skills content from questionnaires'
status: completed
type: task
priority: normal
tags:
    - ready-for-human
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-17T15:59:12Z
parent: portfolio-4rt0
blocked_by:
    - portfolio-vg1p
---

## Parent

portfolio-4rt0 (Unit 3: Skills). Design: the Unit 3 section of `docs_src/specs/units.md` (fully decided in the 2026-11-16 grilling). Vocabulary: `CONTEXT.md` (Skill, Skill group, Skill subgroup, Certificate). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The real Skills content, written with the Owner: one questionnaire per Skill group in `docs_src/skills/`, grilled with the Owner (their words polished into CV English, nothing invented, answers kept verbatim, no agent draft variants kept), then the message JSON drafted and approved by the Owner.

## Acceptance criteria

- [x] One questionnaire per Skill group, questions and the Owner's verbatim answers kept
- [x] Every Skill's overview tells depth in words where the Owner gives one ("expert", "confident", "application-level"), never as a rating; no years, no demo links, no company mentions (amended with the Owner: some overviews say how the Owner uses the Skill instead)
- [x] Kotlin: learnt and certified, not yet used in commercial work
- [x] The Skill lists per group fixed with the Owner (the spec's lists are examples)
- [x] Message JSON approved by the Owner, replacing the placeholders; the 3.0 test passes
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-vg1p

## Notes

- 2026-11-17, Frontend round 3/4: the Owner restores a "Programming languages" group, lost between the 2026-11-16 grilling (nine areas) and the spec (seven). Groups, in order: Programming languages, Frontend, Backend, AI, Databases & search, Cloud & DevOps (observability included), Testing & quality, Engineering practice. To apply here: spec (Unit 3), `config.ts`, the 3.0 test, `skills.json`. Backend keeps the frameworks; the languages move to the new group.
- The Owner avoids claiming "architect": the Backend subgroup "APIs & architecture" gets a new name (Backend round 1).

- 2026-11-17, review follow-up with the Owner: overviews without a depth word stay as approved (the depth rule is amended in the spec and CONTEXT.md); Google Cloud keeps "the stack this site runs on" (true once published); pytest has no "Expert" on purpose; the Kotlin and Claude Code & Codex lines are approved.

## Summary of Changes

- Questionnaires, one per Skill group, with the questions and the Owner's verbatim answers: `docs_src/skills/{programming-languages,frontend,backend,ai,databases,cloud-devops,testing,practice}.md`.
- Eight Skill groups, not seven: the Owner restored "Programming languages" (lost between the grilling and the spec) and moved AI to 4th. Subgroups: Frontend "Architecture & ecosystem", Backend "APIs & services" (no architect claim), AI "AI-assisted development", Databases & search "SQL", "NoSQL", "ORMs & drivers". Cloud & DevOps is flat, observability in one Skill.
- `frontend/src/i18n/en/skills.json`: every Skill's name and overview as approved by the Owner, no placeholder left; Zod added to Frontend's Libraries. Same-depth tools merged into one Skill whose name lists them (Express & Koa, Jest, Vitest & Mocha, ...).
- `pages/skills/content/`: `config.ts` ids in display order, `content.ts` the new structure; the Bash certificate now backs Linux; Kotlin says "No production experience yet". The 3.0 test has one table-driven check of every group's Skill names plus Kotlin and no-placeholder checks (25 tests then 17 after merging, all green).
- Spec (Unit 3) updated to the eight groups and their lists; the depth rule amended; Unit 5's input gains CQRS, microservices, system design and mentoring.
- Downstream beans: portfolio-8a73 (copy format example), portfolio-gcla (eight groups), portfolio-3q18 (open question: a group heading over subgroups only). New draft bean portfolio-tv33 for the CCAR-F/CCAR-P certificates the Owner will post.
