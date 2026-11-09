---
# portfolio-lz1t
title: 'Unit 1.0: Board and message contracts'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-09T13:38:39Z
parent: portfolio-m9gt
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

Lock the types and data every later Unit 1 ticket builds on, before any feature code (Stage 0). The five Panel ids in Board order, the URL of each state, the Board state, and the mapping between URLs and states. The first English messages for the Landing and the Board, with a message-id type derived from them and a check that every message is valid ICU.

## Acceptance criteria

- [x] Unit and integration tests written first and red, then green (TDD, per the rules)
- [x] Panel ids exist in Board order: About, What I do, Skills, Chat with me, Contact. A test locks the order.
- [x] Each Panel id maps to its URL and back (`/about`, `/what-i-do`, `/skills`, `/chat`, `/contact`); `/` maps to the Landing and `/explore` to the default Board.
- [x] The Board state type is `default | expanded(panel)`; state → URL → state round-trips for every state.
- [x] An unknown path maps to `/` and a trailing slash is dropped (`/skills/` → `/skills`); the mapping says when the URL must be replaced rather than pushed.
- [x] `@formatjs/intl` is installed. English messages in the i18n folder, one file per area (Landing, Board), ids prefixed by area: site title "A.Durnev portfolio", logo label, status badge text, each Panel's title, Sublabels for What I do ("36 Takeovers") and Chat with me ("AI agent trained on my data"), close labels ("Close <Panel>").
- [x] A message-id type is derived from the English files; an unknown id is a type error (locked by a type-level check).
- [x] A test parses every message as ICU and fails on a malformed one.
- [x] `scripts/verify.sh` GREEN

## Blocked by

- None (can start immediately)

## Seams under test

- `hooks/useRoute` public index: `PANEL_IDS`, `pathOf(route)`, `resolvePath(pathname)`, types `PanelId`, `BoardState`, `Route`. The mapping lives with the route hook (design: "The route hook holds the Panel ids…"); `useRoute.ts` itself arrives with Unit 1.3.
- `i18n` public index: English messages, the `MessageId` type, and the ICU check over every message file.

## Decisions

- Panel ids are camelCase domain names (`about`, `whatIDo`, `skills`, `chatWithMe`, `contact`), decoupled from their URL slugs (`chatWithMe` → `/chat`). Message ids follow them: `board.panel.<id>.title|sublabel|close`.
- Route shape: `Route = landing | board(BoardState)`, `BoardState = default | expanded(panel)`. `resolvePath(pathname)` returns `{ route, path, replace }`; `replace` is true exactly when the requested path isn't canonical (trailing slashes, unknown paths, `""`). Paths are case-sensitive (`/Skills` → `/`).
- `hooks/useRoute/` holds the mapping now (`config.ts`, `routes.ts`, `types.ts`); `useRoute.ts` arrives with Unit 1.3. Until then the folder is a known exception to the "hook folders have useX.ts" rule.
- The site title lives in a third area file, `site.json` (`site.title`), because both the Landing (1.2) and the Board (1.5) use it. Landing and Board messages are in `landing.json` and `board.json`.
- Close labels are one message per Panel ("Close About", …), not one `Close {panel}`: names may inflect in other languages.
- The logo label ("Portfolio home") and the status badge texts ("API: checking/ok/down") keep today's wording so Unit 1.2 can swap them in without a visible change. A new logo label for "opens the Board" is a separate wording decision.
- `@formatjs/intl` is pinned to 6.1.4 (6.1.5 was published the day before). `@formatjs/icu-messageformat-parser` is a devDependency, pinned to the 3.5.22 that `@formatjs/intl` 6.1.4 uses (its parser isn't re-exported): bump both together.

## Findings for later tickets

- Unit 1.4: `board.panel.${PanelId}.sublabel` is a `MessageId` for two Panels only, so "a Panel has a Sublabel when its Sublabel message exists" needs a runtime guard (e.g. an `isMessageId` type guard in `i18n/`) rather than a direct lookup.
- Tests under jsdom: the global `URL` is jsdom's, which `node:fs` rejects ("The URL must be of scheme file"). Use `import.meta.dirname` + `node:path` for files on disk.

## Summary of Changes

- `frontend/src/hooks/useRoute/`: the Stage 0 route contract. `config.ts` holds `PANEL_IDS` (Board order) and `PANEL_PATHS`. `types.ts` holds `PanelId`, `BoardState`, `Route`, `RoutePath` (derived from `PANEL_PATHS`) and `ResolvedPath`. `routes.ts` holds `pathOf(route)` and `resolvePath(pathname)`, built from one table of every state. `routes.test.ts` locks the order, every state ↔ URL in both directions, trailing-slash dropping and unknown paths → `/`, with `replace` set.
- `frontend/src/i18n/`: English messages in `en/site.json`, `en/landing.json` and `en/board.json` (ids prefixed by area), merged into `enMessages` (`messages.ts`), plus `MessageId = keyof typeof enMessages` (`types.ts`). `messages.test.ts` reads every file on disk and checks the area prefixes, that each file is wired into `enMessages`, the required texts (site title, logo label, status badge, Panel titles, Sublabels, close labels), and ICU validity, with a self-test on malformed messages. It also holds type-level `expectTypeOf` checks that tsrs enforces (an unknown id is a type error).
- Dependencies: `@formatjs/intl` 6.1.4 (runtime) and `@formatjs/icu-messageformat-parser` 3.5.22 (dev, for the ICU test).
- Reviewed on two axes (standards, spec). Applied: one source for the Panel paths (`config.ts`, which also removes a types ↔ routes import cycle), one route table for both directions, readonly state types, `PanelPath` kept private, `expectTypeOf` instead of a no-op assertion, and a file-list test that new areas don't break.
