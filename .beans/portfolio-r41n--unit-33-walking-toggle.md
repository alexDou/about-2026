---
# portfolio-r41n
title: 'Unit 3.3: Walking toggle'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-18T14:43:02Z
parent: portfolio-4rt0
---

## Parent

portfolio-4rt0 (Unit 3: Skills). Design: the Unit 3 section of `docs_src/specs/units.md` (fully decided in the 2026-11-16 grilling). Vocabulary: `CONTEXT.md` (Skill, Skill group, Skill subgroup, Certificate). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The walking toggle: a smaller version of the "toggle switch with legs" in `support_files/skills/toogle/` (SCSS + React reference, no licence; ours written after it in CSS Modules, no licence file kept), as a presentational switch in `components/ui/`. First a quick throwaway prototype (`prototype` skill) for the Owner to approve the scale and speed.

## Acceptance criteria

- [x] Prototype shown to the Owner; scale and speed approved
- [x] Tests written first and red, then green (TDD)
- [x] Scaled so its track is the row's height (`--control-height`, 35px, shared with Copy skills), no face, no dirt particles
- [x] A 1s walk; head and legs `#25363a`; track `#98b2ae` off, `#04b198` on
- [x] The walk plays only after the first change (no animation on load), driven by state, no imperative code
- [x] Reduced motion: the handle only slides
- [x] A `<button role="switch" aria-checked>` named by a label from the props, with no visible label: the label shows as a hint to the right on hover or keyboard focus, in CSS alone (no popover, no `interestfor`), in the palette, fading and sliding in and out
- [x] Reports a change only once the walk (or, with reduced motion, the slide) has ended
- [x] `scripts/verify.sh` GREEN

## Blocked by

- None (can start immediately)

## Notes

- Prototype (2026-11-18): `support_files/skills/toogle-prototype/index.html` (git-ignored, local, open in a browser). Presets A to D plus the reference proportions, sliders for head size and walk duration, a reduced-motion switch. Waiting for the Owner to pick scale and speed.
- Port gotcha: form controls do not inherit `font`, so the input needs `font: inherit` or its em sizes come out at the browser default.

- Owner feedback round 1 (2026-11-18): one switch for the whole page, in the row above every Skill group (Expand all left, Copy skills right). Scale up: the switch's track matches the Copy skills button's height, both 34-36px. No visible label: "Expand all" shows in an HTML popover on hover (the input keeps it as its accessible name). The overviews open or close only after the walk ends. Prototype updated to match; presets now pick height (34-36px) and walk speed.

- Owner feedback round 2 (2026-11-18): Copy skills gets a 20px radius. The overviews open and close with a quick, smooth CSS transition (prototype: grid rows 0fr to 1fr plus a fade, 220ms; the arrow turns). The hint is an HTML popover with no JS, opened by `interestfor` (hover or focus), placed to the right of the switch, in the palette, with a CSS entry and exit (`@starting-style`). `interestfor` works on buttons and links only, so the prototype's switch is a `<button role="switch" aria-checked>`, not a native checkbox: needs the Owner's OK, as the spec names a native checkbox. The close corner change went to its own bean, portfolio-mnmz (under the Refactoring epic, portfolio-vqi0).

- Owner decisions round 3 (2026-11-18): 35px and a 1s walk (preset A). Button with `interestfor` rather than a native checkbox: left to me, chosen for a popover with no JS. Track `#98b2ae` off, `#04b198` on. Spec and criteria amended; Copy skills (radius, height) noted on portfolio-8a73, the overview transition on portfolio-3q18, Expand all acting after the walk on portfolio-zb2n.

- Owner decision round 4 (2026-11-18): `interestfor` rejected, as Firefox and Safari lack it. The hint is a plain element after the track, shown by `:hover` (inside `@media (hover: hover)`) and `:focus-visible` through `~`, placed in a zero-width grid column after the track so it overflows to the right and takes no room (`justify-self: start`, or it would stretch to the column's zero width). No anchor positioning either. The switch stays a button with `role="switch"`: it works everywhere, and the Owner left the choice to me. `src/octane-jsx.d.ts` (the `interestfor` type) removed again.
- Checked in built pages (Rspack production build, the toggle mounted for the check and removed again): Chromium 156 and Firefox 157, hover and keyboard focus show the hint to the right, Space toggles, `onChange` fires about 1s after the click (after the walk) or about 0.2s under reduced motion (after the slide). WebKit could not launch on this Linux host (missing system libraries), so Safari is unchecked; the hint uses only `:hover`, `:focus-visible`, `visibility` and `opacity` transitions, which Safari has long supported.
- One change to the reference's keyframes: the folded legs rest 2 units down instead of 1, fully past their clip. At 1 they lay on the clip's edge and a hairline showed under the track's rounded end at rest.
- The note on `font: inherit` above concerned the checkbox; the button needs it as well, for the same reason.

## Summary of Changes

- `components/ui/walking-toggle/` (`WalkingToggle`): a switch whose handle walks across its track on two legs, after the reference in `support_files/skills/toogle/`, without face or dirt. Uncontrolled: it keeps the position the Visitor gives it and calls `onChange(on)` once the handle has arrived (the handle's own `animationend`, or `transitionend` under reduced motion), never on load or on the click itself.
- A `<button role="switch" aria-checked>` named by `label`, with no visible label: the label shows as a hint to the right on hover or keyboard focus, in CSS alone, works in every browser.
- Look (approved in the prototype): track `--control-height` tall (new token, 35px, shared with Copy skills), `#98b2ae` off, `#04b198` on, head and legs `#25363a`, a 1s walk, played only after the first change; under reduced motion the handle only slides. Track, handle and hint share one grid, no absolute positioning.
- Tests: `_specs_/WalkingToggle.test.ts` (role, name, hint, walk only after a change, report after the walk or slide only, the legs' animations ignored) and `_specs_/styles.test.ts` (height token, palette, 1s walk, both walk directions, no face or dirt, reduced motion, hint placement and CSS show/hide).
- Spec (`docs_src/specs/units.md`) and criteria amended with the Owner's decisions; notes for 3.4, 3.5 and 3.7 on their beans. Follow-ups under the Refactoring epic: portfolio-mnmz (close corner), portfolio-werw (one hook for SVG-safe ids).
