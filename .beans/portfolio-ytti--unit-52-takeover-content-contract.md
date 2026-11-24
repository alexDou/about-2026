---
# portfolio-ytti
title: 'Unit 5.2: Takeover content contract'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-24T13:52:15Z
updated_at: 2026-11-24T13:52:15Z
parent: portfolio-349l
blocked_by:
    - portfolio-s2ln
---

## Parent

portfolio-349l (Unit 5: What I do). Design: the Unit 5 section of `docs_src/specs/units.md` ("Decided"). Vocabulary: `CONTEXT.md` (Takeover, Takeover group, Benefits). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The What I do content contract: the Takeover content type (Takeover group, title, description, optional Benefits), the six Takeover groups in copy order, a `what-i-do` message area with placeholder Takeovers, and the JSON validation test the later stages build on. The content belongs to the What I do page, as Skills' does.

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] The six Takeover groups as named kinds, in copy order: System design, AI, Frontend, Backend, Cloud & DevOps, R&D & teamwork
- [ ] Every Takeover has a known group, a title and a description message; Benefits optional
- [ ] Takeover ids are unique; every message exists, formats and is used
- [ ] No count is checked: neither the number of Takeovers nor a group's size
- [ ] Placeholder content the test accepts, at least one Takeover per group, so later stages can build before the content lands
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-s2ln (Unit 5.1: Takeover group pictures): the prototype and the pictures come first
