---
# portfolio-gcla
title: 'Unit 3.N: Skills E2E'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-16T09:50:04Z
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

- [ ] Opening `/skills` shows the heading, Expand all, Copy skills and the seven Skill groups in order, every Skill name visible and every overview hidden
- [ ] A Skill's arrow opens and closes its overview
- [ ] The heading rule: a heading click opens all of its Skills; with some closed by hand it closes all; all closed by hand → the next click opens
- [ ] Expand all opens and closes every overview and keeps its own position
- [ ] Copy skills puts the full structured text on the clipboard
- [ ] A Certificate link opens the dialog; Escape closes it and the Skills Panel stays open
- [ ] The final content is in place (no placeholder text)
- [ ] `pnpm --dir frontend e2e` green; `scripts/verify.sh` GREEN

## Blocked by

- portfolio-i2yz
- portfolio-zb2n
- portfolio-63rn
- portfolio-8a73
