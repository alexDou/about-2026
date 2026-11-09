---
# portfolio-lz1t
title: 'Unit 1.0: Board and message contracts'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-09T10:30:50Z
parent: portfolio-m9gt
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

Lock the types and data every later Unit 1 ticket builds on, before any feature code (Stage 0). The five Panel ids in Board order, the URL of each state, the Board state, and the mapping between URLs and states. The first English messages for the Landing and the Board, with a message-id type derived from them and a check that every message is valid ICU.

## Acceptance criteria

- [ ] Unit and integration tests written first and red, then green (TDD, per the rules)
- [ ] Panel ids exist in Board order: About, What I do, Skills, Chat with me, Contact. A test locks the order.
- [ ] Each Panel id maps to its URL and back (`/about`, `/what-i-do`, `/skills`, `/chat`, `/contact`); `/` maps to the Landing and `/explore` to the default Board.
- [ ] The Board state type is `default | expanded(panel)`; state → URL → state round-trips for every state.
- [ ] An unknown path maps to `/` and a trailing slash is dropped (`/skills/` → `/skills`); the mapping says when the URL must be replaced rather than pushed.
- [ ] `@formatjs/intl` is installed. English messages in the i18n folder, one file per area (Landing, Board), ids prefixed by area: site title "A.Durnev portfolio", logo label, status badge text, each Panel's title, Sublabels for What I do ("36 Takeovers") and Chat with me ("AI agent trained on my data"), close labels ("Close <Panel>").
- [ ] A message-id type is derived from the English files; an unknown id is a type error (locked by a type-level check).
- [ ] A test parses every message as ICU and fails on a malformed one.
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- None (can start immediately)
