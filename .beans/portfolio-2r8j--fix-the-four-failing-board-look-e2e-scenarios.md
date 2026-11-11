---
# portfolio-2r8j
title: Fix the four failing board-look E2E scenarios
status: todo
type: bug
tags:
    - needs-triage
created_at: 2026-11-11T14:54:57Z
updated_at: 2026-11-11T14:54:57Z
parent: portfolio-m9gt
---

## What is wrong

Four `board-look.feature` scenarios fail on the production build, already before portfolio-3sox (noted in portfolio-2dsc, 56/60 at the time):

- Desktop shows equal-width full-height columns (1280x800): `every Panel title is centred in its Panel` is off by ~25.6px.
- On a phone the dots stand at the left border, before the title (375x667, 320x568): the dots row is 45.9px / 34.9px wide, not longer than 4 dots (48px).
- Same outline at 700x800: the dots end ~141.5px before the title instead of 16px.

Likely from the CSS layout refactor (portfolio-9od8) or the View Transitions adoption (portfolio-2dsc). Decide per case whether the layout or the test is wrong.

## Acceptance criteria

- [ ] Each failure diagnosed: layout bug or stale test
- [ ] Fixed; `pnpm --dir frontend e2e` green
- [ ] `scripts/verify.sh` GREEN
