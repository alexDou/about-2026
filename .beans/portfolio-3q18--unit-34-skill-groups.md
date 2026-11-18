---
# portfolio-3q18
title: 'Unit 3.4: Skill groups'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-18T15:31:30Z
parent: portfolio-4rt0
blocked_by:
    - portfolio-vg1p
---

## Parent

portfolio-4rt0 (Unit 3: Skills). Design: the Unit 3 section of `docs_src/specs/units.md` (fully decided in the 2026-11-16 grilling). Vocabulary: `CONTEXT.md` (Skill, Skill group, Skill subgroup, Certificate). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The Skills Panel's groups: opening `/skills` shows the "Skills" heading, the header row (room for Expand all on the left and Copy skills on the right), and the Skill group blocks, centred with a max-width on desktop and full width minus the side padding on phones. Each block is filled with the light `#d1dcd9` with `#25363a` text and shows the group name, its Skills and its subgroups.

## Acceptance criteria

- [x] Tests written first and red, then green (TDD)
- [x] Default view: every group and subgroup shows its Skill names; every overview hidden
- [x] A Skill's filled arrow is its only toggle: a button padded to a 24px target or more, with an accessible name; the Skill's name stays plain, selectable text
- [x] Group and subgroup headings keep a state of their own, closed by default; a click flips it and sets all their Skills to match (open all / close all); a heading acts on its own group or subgroup only
- [x] Opening or closing Skills by hand leaves a heading's state alone, except: all closed by hand → closed; all opened by hand → open (so the next heading click always does something visible)
- [x] The heading rule lives in pure functions with their own unit tests
- [x] All text from the `skills` messages
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-vg1p

## Notes

- From 3.1 (2026-11-17): groups can hold several subgroups (Databases & search has three: SQL, NoSQL, ORMs & drivers) and no Skills of their own; Backend and AI also have one subgroup each. The spec says "a heading acts on its own group or subgroup only" and "sets all their Skills": decide with the Owner whether a group heading over subgroups only (Databases) opens the subgroups' Skills or does nothing.

- From the walking toggle prototype (2026-11-18): an overview opens and closes with a quick, smooth CSS transition (the prototype: grid rows 0fr to 1fr with a fade, about 220ms, the arrow turning; none with reduced motion). No JS animation.

## Decisions

- Owner (2026-11-18): a group heading covers every Skill beneath it, its subgroups' Skills included (Databases & search opens all three subgroups); each subgroup heading keeps its own state and follows by the heading rule.
- State: signals module `components/domain/skills/overviews/` (`overviews$`, `toggleSkill`, `toggleHeading`, `reset`); the rule in pure functions in `state.ts`. Skill states and heading states are two records, absent meaning closed. 3.5 adds its set-all function there and passes every group's headings.
- New message `skills.overviewToggle` ("Overview of {name}", the arrow's accessible name: neutral, so the name and `aria-expanded` do not contradict). The content test lists messages the components read (`COMPONENT_MESSAGES`); add new component-read `skills.*` messages there.
- Header row: rendered empty (`skills-page__header-row`, flex, space-between, `--control-height` tall) for 3.5 and 3.7 to fill.
- Overview: `inert` when closed, grid rows 0fr to 1fr with fade, `--overview-duration` (220ms), none under reduced motion.
- E2E step "the Stripes are rows at least 44px tall, with no Sublabel" now looks for paragraphs inside the Stripes, not the whole page (the Skills page has paragraph overviews).

## Summary of Changes

The Skills Panel shows the eight Skill group blocks (Card surface) under the header row: group heading, Skills, subgroups. Each Skill has a filled arrow button (24px target, `aria-expanded`) that opens its overview; the name is plain text. Group and subgroup headings are buttons with their own state, applying open all / close all and following the Skills by the rule. Pure rules and signals module under `components/domain/skills/overviews/`; components `skill-group/` (with `skill-subgroup/`), `skill-heading/`, `skill-entry/`. Tests: rules, module, each component, the page and the entry stylesheet. Not covered here: the E2E (3.N).
