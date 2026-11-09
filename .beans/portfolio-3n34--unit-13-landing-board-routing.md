---
# portfolio-3n34
title: 'Unit 1.3: Landing ↔ Board routing'
status: todo
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-09T14:35:47Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-lz1t
    - portfolio-u8a6
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

URLs drive the site. Clicking the Landing logo opens `/explore` with a history entry, browser Back returns to the Landing, and a direct visit to `/explore` shows the Board. For now the Board lists the five Panel titles from messages as plain links. Unknown paths and trailing slashes are corrected without a history entry. Every route change records whether a user action caused it, for the animation tickets.

## Acceptance criteria

- [ ] Unit and integration tests written first and red, then green (TDD, per the rules)
- [ ] Our own route hook over the History API (no router package), built on the Unit 1.0 mapping and shared by App, Board and Landing.
- [ ] Logo click → `/explore` as a new history entry; Back → Landing; Forward → Board.
- [ ] A direct visit to `/explore` renders the Board; an unknown path is replaced by `/`; `/explore/` is replaced by `/explore`.
- [ ] The Board renders the five Panel titles in order as links to their URLs. A plain click is handled in the app without a reload; modifier and middle clicks keep browser behaviour (new tab). A Panel URL renders the Board for now; opening a Panel comes with Unit 1.5.
- [ ] A route change caused by a click is marked as user-triggered; the initial load and Back/Forward are not.
- [ ] The logo E2E scenario "Clicking the logo logs a message" becomes "Clicking the logo opens the Board"; `pnpm --dir frontend e2e` stays green.
- [ ] The Board renders the document title "A.Durnev portfolio" from `site.title` through its own `<title>`, as the Landing does. Since Unit 1.2, `index.html` has no static title, so without this `/explore` has none.
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-lz1t (Unit 1.0: Board and message contracts)
- portfolio-u8a6 (Unit 1.2: FormatJS on the Landing)
