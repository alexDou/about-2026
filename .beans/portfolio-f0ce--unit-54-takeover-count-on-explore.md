---
# portfolio-f0ce
title: 'Unit 5.4: Takeover count on Explore'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-24T13:52:15Z
updated_at: 2026-11-24T13:52:15Z
parent: portfolio-349l
blocked_by:
    - portfolio-ytti
---

## Parent

portfolio-349l (Unit 5: What I do). Design: the Unit 5 section of `docs_src/specs/units.md` ("Decided"). Vocabulary: `CONTEXT.md` (Takeover, Takeover group, Benefits). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

Explore's What I do sublabel tells how many Takeovers there are, counted from the content: "{count} Takeovers", singular for one. The count reaches Explore as data; no component imports a page.

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] The sublabel shows the number of Takeovers in the content, with a plural rule
- [ ] The Explore unit tests and the Explore look scenario no longer expect a fixed 36
- [ ] `scripts/verify.sh` GREEN; `pnpm --dir frontend e2e` passes

## Blocked by

- portfolio-ytti (Unit 5.2: Takeover content contract)
