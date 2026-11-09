---
# portfolio-402i
title: 'Unit 1.8: Backend status in Chat with me and Contact'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-09T10:30:50Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-4zpt
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

The Visitor learns that the backend is unreachable where it matters. One shared health check feeds the Landing badge and the Chat with me and Contact pages. Both pages still open, and each shows an offline note while the backend is down.

## Acceptance criteria

- [ ] Unit and integration tests written first and red, then green (TDD, per the rules), against a mocked API service
- [ ] One health request per page load serves every consumer; the check runs again whenever Chat with me or Contact opens.
- [ ] The Landing badge keeps working off the shared check.
- [ ] Chat with me and Contact show an offline note (text from messages) while the backend is down and none while it is up. A recovered backend clears the note the next time the Panel opens, without a reload.
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-4zpt (Unit 1.5: Open and close a Panel)
