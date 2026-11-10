---
# portfolio-uqsd
title: 'Unit 1.4: Default Board look'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-10T08:32:14Z
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

- [x] Unit and integration tests written first and red, then green (TDD, per the rules)
- [x] Panel and Sublabel components inside the Board chunk. The tone is a prop, switched as a class with `classnames`; each Panel's tone is its position.
- [x] Text colours from the palette: `#d1dcd9` on About, `#25363a` on the other four.
- [x] Titles in the pen's style (uppercase, wide letter-spacing, the line that slides in on hover and focus), at least 1.5rem, Overused Grotesk, centred on both axes by layout. In the default state only the title is clickable.
- [x] A Sublabel renders only for Panels whose Sublabel message exists (What I do, Chat with me).
- [x] Desktop: columns share the width evenly at full screen height; the Board is at least 32rem tall.
- [x] Mobile (≤ 640px wide): rows share the height evenly; the Board is at least 420px tall; rows stay readable at ≤ 550px wide (the pen's flaw).
- [x] Checked in the browser at about 1280×800, 375×667 and 360px wide.
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-dbxq (Unit 1.1: Site shell)
- portfolio-3n34 (Unit 1.3: Landing ↔ Board routing)

## Summary of Changes

- `Board` renders five `Panel`s (`components/Panel/`), each with its tone from `TONE_BY_PANEL` (ink, mist, teal, blue, green, the palette in Board order); `Sublabel` lives under `Panel` (its only user). Tone is a prop switched as a class with `classnames` (added, pinned 2.5.1); colours come from the global tokens through `--tone-bg`/`--tone-fg`.
- Titles: pen style (uppercase, 0.2em letter-spacing, the line that slides in on hover and `:focus-visible`), 1.5rem, Overused Grotesk, centred by grid. Sublabel is a `<p>` outside the link, shown where `SUBLABEL_BY_PANEL` has a message (What I do, Chat with me); a test keeps that map equal to the Sublabel messages.
- Layout: desktop equal-width full-height columns (Board min 32rem), mobile (<= 640px) equal-height rows (Board min 420px, 84px per row at least).
- Review findings fixed: "CONTACT" clipped at 641-700px (tighter letter-spacing there), the Sublabel overflowed narrow columns and the shortest rows (capped to the Panel width via `cqw`, less title padding), removed a test-only `data-tone`.
- E2E `board-look.feature` (28 scenarios in total): computed colours, title style, Sublabels, layouts at 1280x800, 375x667, 360x640, 320x568, short windows, 641px, hover/focus line. Screenshots checked at 1280x800, 375 and 360 wide.
