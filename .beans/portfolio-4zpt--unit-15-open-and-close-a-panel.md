---
# portfolio-4zpt
title: 'Unit 1.5: Open and close a Panel'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-10T11:38:04Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-uqsd
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

Clicking a Panel title opens it: its URL, the Expanded panel showing that Panel's page, and the other Panels as Stripes. A Stripe switches Panels; the close button and Escape return to the default Board. Every state works as a deep link. No animation yet (Unit 1.6).

## Acceptance criteria

- [x] Unit and integration tests written first and red, then green (TDD, per the rules)
- [x] Five page shells (About, What I do, Skills, Chat with me, Contact), each rendering only its title through a shared, reusable Heading component. App passes the Expanded panel's page into the Board.
- [x] Stripe and Expanded panel are separate components inside the Board chunk, with tone, title and handlers as props.
- [x] Desktop Stripes: as narrow as the title plus padding, title vertical top to bottom, sticky while the page scrolls; the whole Stripe is clickable.
- [x] Mobile Stripes: rows of title height plus a little padding (at least 44px), without Sublabel, not sticky.
- [x] Clicking a Stripe opens that Panel; clicking the Expanded panel itself does nothing.
- [x] A small circle-× close button sits at the top right and stays in view while scrolling; its `title` is "Close <Panel>" from messages and its icon is hidden from screen readers. It and Escape return to `/explore`.
- [x] Every change adds a history entry, and Back/Forward walk through them.
- [x] The page scrolls to show long content. Browser scroll restoration is off, and every Board state starts at the top.
- [x] Opening moves focus to the Expanded panel's heading; closing returns it to the Panel that was open.
- [x] The document title is "<Panel> · A.Durnev portfolio" per Expanded panel and "A.Durnev portfolio" on `/explore`. `theme-color` follows the Expanded panel's colour.
- [x] A deep link to each Panel URL renders that Panel opened.
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-uqsd (Unit 1.4: Default Board look)

## Summary of Changes

- Five page shells (`pages/*Page`) render a shared `components/ui/Heading` (h1, focusable from code). `App` passes the Expanded panel's page into `Board` as children; `Board` now takes a `board` prop.
- `Board` chunk: new `Stripe` and `ExpandedPanel` (close button, Escape), hooks `useBoardFocus`, `useScrollReset`, `useThemeColor`, `usePrevious`. `PanelTone` and `TITLE_BY_PANEL` moved up to the Board (shared by three sub-components); `config.ts` gained close-label and colour-token maps.
- Shared `hooks/useDocumentTitle` (Landing now uses it); new message `board.expanded.documentTitle`. `theme-color` reads the Panel's palette token at run time, so no hex is duplicated.
- The route store turns browser scroll restoration off on creation (an effect would run too late on a reload).
- Opening a Panel ends the entrance state, so Panels that return on close do not replay the unfold.
- Focus moves also on Back/Forward, not only on clicks; a deep link moves none.
- E2E: `panels.feature` (+ routing scenario updated). 7 `board-look.feature` scenarios fail, the same 7 as on HEAD before this work (dots on phone, centred titles, "unfold has ended"): not touched here.
- Note: the page shells and the first tests for Heading were written together with their code rather than strictly red first.
