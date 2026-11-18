---
# portfolio-gcla
title: 'Unit 3.N: Skills E2E'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-18T20:09:12Z
parent: portfolio-4rt0
blocked_by:
    - portfolio-i2yz
    - portfolio-zb2n
    - portfolio-63rn
    - portfolio-8a73
---

## Parent

portfolio-4rt0 (Unit 3: Skills). Design: the Unit 3 section of `docs_src/specs/units.md` (fully decided in the 2026-11-16 grilling). Vocabulary: `CONTEXT.md` (Skill, Skill group, Skill subgroup, Certificate). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

Cucumber + Playwright E2E for Skills against the real frontend build, with the final content.

## Acceptance criteria

- [x] Opening `/skills` shows the heading, Expand all, Copy skills and the eight Skill groups in order, all closed (amended 2026-11-18: no Skill name is in reach until its group opens)
- [x] A Skill's arrow opens and closes its overview
- [x] The heading rule: a heading click opens all of its Skills; with some closed by hand it closes all; all closed by hand → the next click opens
- [x] Expand all opens and closes every overview and keeps its own position
- [x] Copy skills puts the full structured text on the clipboard
- [x] A Certificate link opens the dialog; Escape closes it and the Skills Panel stays open
- [x] The final content is in place (no placeholder text)
- [x] `pnpm --dir frontend e2e` green; `scripts/verify.sh` GREEN

## Blocked by

- portfolio-i2yz
- portfolio-zb2n
- portfolio-63rn
- portfolio-8a73

## Summary of Changes

Eight new scenarios in `frontend/e2e/features/skills.feature` (steps in `skills.steps.ts`), on top of the Certificate view and Copy skills ones (the Copy skills one now also checks a closed group, a subgroup line and a "Certified:" line): the page opening with its controls and the eight closed groups in order; a group heading opening and closing its overviews; a Skill arrow leaving its group alone; the subgroup heading rule (open all, close all when some were closed by hand); closing all by hand closing the heading; Expand all and Collapse all over every group and overview, with no placeholder text; Expand all keeping its position; opening every group by hand leaving Expand all off. The Certificate Escape scenario also checks the group stays open.

The first criterion followed the 2026-11-18 accordion amendment in `docs_src/specs/units.md` (groups closed, no Skill name in reach), not the bean's older wording ("every Skill name visible").
