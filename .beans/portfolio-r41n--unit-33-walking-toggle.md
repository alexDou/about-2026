---
# portfolio-r41n
title: 'Unit 3.3: Walking toggle'
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

The walking toggle: a smaller version of the "toggle switch with legs" in `support_files/skills/toogle/` (SCSS + React reference, no licence; ours written after it in CSS Modules, no licence file kept), as a presentational switch in `components/ui/`. First a quick throwaway prototype (`prototype` skill) for the Owner to approve the scale and speed.

## Acceptance criteria

- [ ] Prototype shown to the Owner; scale and speed approved
- [ ] Tests written first and red, then green (TDD)
- [ ] A 6×6 head instead of 12×12, scaled feet and input, no face, no dirt particles
- [ ] A faster walk (about 1s instead of 2.5s), palette `#25363a`
- [ ] The walk plays only after the first change (no animation on load), driven by state, no imperative code
- [ ] Reduced motion: the handle only slides
- [ ] A native checkbox with `role="switch"` and a label from the props
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- None (can start immediately)
