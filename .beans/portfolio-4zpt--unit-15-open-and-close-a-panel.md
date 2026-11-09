---
# portfolio-4zpt
title: 'Unit 1.5: Open and close a Panel'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-09T10:30:50Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-uqsd
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

Clicking a Panel title opens it: its URL, the Expanded panel showing that Panel's page, and the other Panels as Stripes. A Stripe switches Panels; the close button and Escape return to the default Board. Every state works as a deep link. No animation yet (Unit 1.6).

## Acceptance criteria

- [ ] Unit and integration tests written first and red, then green (TDD, per the rules)
- [ ] Five page shells (About, What I do, Skills, Chat with me, Contact), each rendering only its title through a shared, reusable Heading component. App passes the Expanded panel's page into the Board.
- [ ] Stripe and Expanded panel are separate components inside the Board chunk, with tone, title and handlers as props.
- [ ] Desktop Stripes: as narrow as the title plus padding, title vertical top to bottom, sticky while the page scrolls; the whole Stripe is clickable.
- [ ] Mobile Stripes: rows of title height plus a little padding (at least 44px), without Sublabel, not sticky.
- [ ] Clicking a Stripe opens that Panel; clicking the Expanded panel itself does nothing.
- [ ] A small circle-× close button sits at the top right and stays in view while scrolling; its `title` is "Close <Panel>" from messages and its icon is hidden from screen readers. It and Escape return to `/explore`.
- [ ] Every change adds a history entry, and Back/Forward walk through them.
- [ ] The page scrolls to show long content. Browser scroll restoration is off, and every Board state starts at the top.
- [ ] Opening moves focus to the Expanded panel's heading; closing returns it to the Panel that was open.
- [ ] The document title is "<Panel> · A.Durnev portfolio" per Expanded panel and "A.Durnev portfolio" on `/explore`. `theme-color` follows the Expanded panel's colour.
- [ ] A deep link to each Panel URL renders that Panel opened.
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-uqsd (Unit 1.4: Default Board look)
