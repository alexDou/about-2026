---
# portfolio-ii5o
title: 'Unit 5.N: What I do E2E and Definition of Done'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-24T13:52:15Z
updated_at: 2026-11-24T13:52:15Z
parent: portfolio-349l
blocked_by:
    - portfolio-n5js
    - portfolio-f0ce
    - portfolio-7rwq
    - portfolio-mla2
---

## Parent

portfolio-349l (Unit 5: What I do). Design: the Unit 5 section of `docs_src/specs/units.md` ("Decided"). Vocabulary: `CONTEXT.md` (Takeover, Takeover group, Benefits). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The whole What I do feature in one Cucumber + Playwright pass on the frontend build (no backend: the content is static). It checks the Definition of Done and brings the epic's body up to date.

## Acceptance criteria

- [ ] A Visitor sees every Takeover as a card, with its group name and title
- [ ] Hover shows a card's back on desktop; leaving shows the front
- [ ] The pin holds a card, the unpin releases it
- [ ] Tab and Enter hold a card, Escape releases it and the panel stays open; Escape with no held card closes the panel
- [ ] On a touch screen, "See details" shows and a tap holds a card; the unpin releases it
- [ ] Shuffle changes the order and releases every held card
- [ ] Copy takeovers puts the agreed text on the clipboard
- [ ] Explore's sublabel shows the Takeover count
- [ ] Reduced motion: no turning, no moving cards
- [ ] `scripts/verify.sh` GREEN; `pnpm --dir frontend e2e` passes

## Blocked by

- portfolio-n5js (Unit 5.3: Takeover content)
- portfolio-f0ce (Unit 5.4: Takeover count on Explore)
- portfolio-7rwq (Unit 5.8: Group pictures on the Takeover cards)
- portfolio-mla2 (Unit 5.9: Shuffle)
