---
# portfolio-2r8j
title: Fix the four failing board-look E2E scenarios
status: completed
type: bug
priority: normal
tags:
    - needs-triage
created_at: 2026-11-11T14:54:57Z
updated_at: 2026-11-11T17:58:04Z
parent: portfolio-m9gt
---

## What is wrong

Four `board-look.feature` scenarios fail on the production build, already before portfolio-3sox (noted in portfolio-2dsc, 56/60 at the time):

- Desktop shows equal-width full-height columns (1280x800): `every Panel title is centred in its Panel` is off by ~25.6px.
- On a phone the dots stand at the left border, before the title (375x667, 320x568): the dots row is 45.9px / 34.9px wide, not longer than 4 dots (48px).
- Same outline at 700x800: the dots end ~141.5px before the title instead of 16px.

Likely from the CSS layout refactor (portfolio-9od8) or the View Transitions adoption (portfolio-2dsc). Decide per case whether the layout or the test is wrong.

## Acceptance criteria

- [x] Each failure diagnosed: layout bug or stale test
- [x] Fixed; `pnpm --dir frontend e2e` green
- [x] `scripts/verify.sh` GREEN


## Decisions (owner, 2026-11-11)

- Desktop title offset: by design (the Panel's `padding-bottom: 20%` lifts the title a tenth of its width above the middle). The test was stale.
- Phone dots: removed.
- Phone dots gap: moot once the dots are gone.

## Summary of Changes

- `Panel/styles.module.css`: the phone dots (`.panel__title::before`, its three-column title grid, `--dots-side-gap`) are gone; on a phone the title spans the row and there are no dots.
- `board-look.feature`: the desktop scenario checks that titles are centred across and sit a tenth of the Panel's width above the middle; the phone outline now checks there are no dots on hover. The phone-only dots steps and helper fields are removed.
- `docs_src/specs/units.md`: the Unit 1 layout text says the same.
- `pnpm --dir frontend e2e`: 75/75.
