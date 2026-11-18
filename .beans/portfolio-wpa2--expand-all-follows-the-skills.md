---
# portfolio-wpa2
title: Expand all follows the Skills
status: completed
type: task
priority: normal
created_at: 2026-11-18T20:18:45Z
updated_at: 2026-11-18T20:23:33Z
parent: portfolio-4rt0
---

## Parent

portfolio-4rt0 (Unit 3: Skills). Amends portfolio-zb2n (Expand all) and portfolio-r41n (walking toggle) on the Owner's word (2026-11-18, after the Skills E2E, portfolio-gcla): "everything expanded manually - the toggle must go ON; correspondingly, when all gets closed by hand toggle is OFF."

## What to build

Expand all follows the Skills. It was a switch that "keeps the position the Visitor gave it and never follows the Skills"; now its position is read from what is open:

- every group and every overview open (by hand or by the switch) → ON, labelled "Collapse all";
- every overview closed (by hand or by the switch; the groups may stay open) → OFF, labelled "Expand all";
- a mix → it stays where it is (the heading rule's precedent: a mix leaves a state alone).

When the Skills move it, it walks like on a click, but a move the Skills caused reports nothing (no `setAll`): only a click does.

## Checklist

- [x] Docs: the Expand all line in Unit 3 of `docs_src/specs/units.md` rewritten
- [x] `WalkingToggle` takes the position it shows (`on`) and reports a click's arrival only; a position change from outside walks it without reporting
- [x] The Skills page derives the position from the overviews state (all open → on, all closed → off, a mix → unchanged)
- [x] Unit tests (state rule, toggle, page); E2E scenarios "keeps its position" and "Opening every group by hand leaves Expand all off" replaced by the new rule
- [x] `pnpm --dir frontend e2e` green; `scripts/verify.sh` GREEN

## Summary of Changes

- `expandedOf(state, groups)` in `overviews/state.ts`: true when every group and overview is open, false when every overview is closed, undefined for a mix.
- `WalkingToggle` takes an optional `position`: it walks there when it differs, and reports (`onChange`) only for a click's arrival, never for a followed move. `SkillsPage` passes `expandedOf(...)`.
- Spec (`units.md`, Expand all) rewritten; the E2E "keeps its position" and "opening every group by hand leaves it off" scenarios replaced by: stays put on a mix, every group by hand → on and back → off, every overview closed by hand (groups open) → off.
- Decision: "all closed" means every overview closed, so hand-closing every arrow with the groups open also turns it off (the label "Expand all" then does something visible).
