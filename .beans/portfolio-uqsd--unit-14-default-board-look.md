---
# portfolio-uqsd
title: 'Unit 1.4: Default Board look'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-09T10:30:50Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-dbxq
    - portfolio-3n34
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

`/explore` looks like the pen's expanded menu in our palette. Five Panels in their tones, each with its palette text colour and the pen's title style, titles centred on both axes, and Sublabels on What I do and Chat with me. Desktop shows equal-width full-height columns; mobile shows equal-height full-width rows that never collapse to slivers.

## Acceptance criteria

- [ ] Unit and integration tests written first and red, then green (TDD, per the rules)
- [ ] Panel and Sublabel components inside the Board chunk. The tone is a prop, switched as a class with `classnames`; each Panel's tone is its position.
- [ ] Text colours from the palette: `#d1dcd9` on About, `#25363a` on the other four.
- [ ] Titles in the pen's style (uppercase, wide letter-spacing, the line that slides in on hover and focus), at least 1.5rem, Overused Grotesk, centred on both axes by layout. In the default state only the title is clickable.
- [ ] A Sublabel renders only for Panels whose Sublabel message exists (What I do, Chat with me).
- [ ] Desktop: columns share the width evenly at full screen height; the Board is at least 32rem tall.
- [ ] Mobile (≤ 640px wide): rows share the height evenly; the Board is at least 420px tall; rows stay readable at ≤ 550px wide (the pen's flaw).
- [ ] Checked in the browser at about 1280×800, 375×667 and 360px wide.
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-dbxq (Unit 1.1: Site shell)
- portfolio-3n34 (Unit 1.3: Landing ↔ Board routing)
