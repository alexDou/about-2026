---
# portfolio-zb2n
title: 'Unit 3.5: Expand all'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-18T19:33:15Z
parent: portfolio-4rt0
blocked_by:
    - portfolio-r41n
    - portfolio-3q18
---

## Parent

portfolio-4rt0 (Unit 3: Skills). Design: the Unit 3 section of `docs_src/specs/units.md` (fully decided in the 2026-11-16 grilling). Vocabulary: `CONTEXT.md` (Skill, Skill group, Skill subgroup, Certificate). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

Expand all: the walking toggle in the header row, labelled "Expand all", as a convenience switch over the whole page: every group and every Skill's overview.

## Acceptance criteria

- [x] Tests written first and red, then green (TDD)
- [x] Off by default; on opens every group and every overview, off closes every overview and every group (groups start closed, so on must show something: Skill groups are accordion bands since the 3.4 rework)
- [x] It keeps the position the Visitor gave it and never follows the Skills: opening everything by hand leaves it off; closing some by hand leaves it on
- [x] The subgroup headings' states follow by the heading rule after Expand all acts; a group's state is whether it shows, so Expand all opens and closes the groups themselves
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-r41n
- portfolio-3q18

## Notes

- From the walking toggle (2026-11-18): the toggle reports a change only when its walk (or reduced-motion slide) has ended; Expand all opens or closes the overviews then, not on click. The toggle has no visible label: "Expand all" is its accessible name and its hover hint.

- The toggle's two labels (2026-11-18): `WalkingToggle` takes `labels: { off, on }`; pass "Expand all" and "Collapse all" from new `skills` messages (every text on the site comes from the messages; the skills content test wants every `skills.*` message used, so add them with the code that reads them).

- From the 3.4 rework (2026-11-18, Owner): the Skills start in closed groups, a group click opens the group and every overview in it, and a closed group hides its Skills. Expand all adds a set-all function to `components/domain/skills/overviews/` (state.ts, pure, tested) that opens or closes every group and every Skill, then applies the subgroup rule.

## Summary of Changes

- `allSet` (pure, `overviews/state.ts`) opens or closes every group and every Skill, then applies the heading rule; `setAll` wraps it on the overviews signal.
- `SkillsPage` puts the `WalkingToggle` in the header row, labelled by new `skills.expandAll` / `skills.collapseAll` messages; it calls `setAll` when the walk ends. The toggle keeps its own position, so it never follows the Skills.
- Tests first: state, signal and page tests (off on load, open all, close all, manual changes leave the toggle alone).
- Fixed a stale subgroup stylesheet test (token `--skills-subgroup-heading-open`) and an oxfmt line in `skill-entry/styles.module.css`, both failing the gate before this work.
