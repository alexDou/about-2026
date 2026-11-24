---
# portfolio-mnmz
title: 'Close corner: the next Panel''s tone; a small (x) on phones'
status: todo
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-18T07:24:23Z
updated_at: 2026-11-18T07:25:45Z
parent: portfolio-vqi0
---

## Context

Owner request (2026-11-18), raised while prototyping the walking toggle (portfolio-r41n). The Expanded panel's close button is `CornerButton` (`components/ui/corner-button/`), used by `ExpandedPanel`: a 24px peeled corner whose flap is the accent red, its arc edge (the "crease", `currentColor`) carrying the contrast.

## What to build

- Desktop: the crease under the flap (the line along the arc) takes the tone of the Panel next to the open one, in Explore order (`PANEL_IDS`), wrapping around: About → What I do, What I do → Skills, Skills → Chat with me, Chat with me → Contact, Contact → About. Tones in `styles/tokens.css` (`--panel-*`).
- Phones (Explore's phone layout, `width < 840px`): a small (x) close button, 24×24, of the kind used before the corner: a round button with a thin ring and an (x) drawn in SVG (see `git show e04f3cc^:frontend/src/components/domain/board/components/expanded-panel/ExpandedPanel.tsrx` and its `styles.module.css`), scaled down to 24×24.

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] The crease's colour comes from the next Panel's tone, for each of the five Panels (the tone passed by the Expanded panel, or a CSS variable set per tone, no hardcoded colours)
- [ ] Phones show the 24×24 (x) instead of the corner; desktop keeps the corner
- [ ] Contrast checked: the crease was there for WCAG 1.4.11 (3:1 against every Panel). Where the next Panel's tone falls below 3:1 on the open Panel (e.g. Chat with me's blue on Skills' teal), ask the Owner before shipping
- [ ] `scripts/verify.sh` GREEN; E2E run, as the change is visible

## Blocked by

- None (can start immediately)
