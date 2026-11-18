---
# portfolio-r41n
title: 'Unit 3.3: Walking toggle'
status: in-progress
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-18T07:26:52Z
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

## Notes

- Prototype (2026-11-18): `support_files/skills/toogle-prototype/index.html` (git-ignored, local, open in a browser). Presets A to D plus the reference proportions, sliders for head size and walk duration, a reduced-motion switch. Waiting for the Owner to pick scale and speed.
- Port gotcha: form controls do not inherit `font`, so the input needs `font: inherit` or its em sizes come out at the browser default.

- Owner feedback round 1 (2026-11-18): one switch for the whole page, in the row above every Skill group (Expand all left, Copy skills right). Scale up: the switch's track matches the Copy skills button's height, both 34-36px. No visible label: "Expand all" shows in an HTML popover on hover (the input keeps it as its accessible name). The overviews open or close only after the walk ends. Prototype updated to match; presets now pick height (34-36px) and walk speed.

- Owner feedback round 2 (2026-11-18): Copy skills gets a 20px radius. The overviews open and close with a quick, smooth CSS transition (prototype: grid rows 0fr to 1fr plus a fade, 220ms; the arrow turns). The hint is an HTML popover with no JS, opened by `interestfor` (hover or focus), placed to the right of the switch, in the palette, with a CSS entry and exit (`@starting-style`). `interestfor` works on buttons and links only, so the prototype's switch is a `<button role="switch" aria-checked>`, not a native checkbox: needs the Owner's OK, as the spec names a native checkbox. The close corner change went to its own bean, portfolio-mnmz (under the Refactoring epic, portfolio-vqi0).
