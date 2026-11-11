---
# portfolio-402i
title: 'Unit 1.8: Backend status in Chat with me and Contact'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-11T11:18:45Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-4zpt
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

The Visitor learns that the backend is unreachable where it matters. One shared health check feeds the Landing badge and the Chat with me and Contact pages. Both pages still open, and each shows an offline note while the backend is down.

## Acceptance criteria

- [x] Unit and integration tests written first and red, then green (TDD, per the rules), against a mocked API service
- [x] One health request per page load serves every consumer; the check runs again whenever Chat with me or Contact opens.
- [x] The Landing badge keeps working off the shared check.
- [x] Chat with me and Contact show an offline note (text from messages) while the backend is down and none while it is up. A recovered backend clears the note the next time the Panel opens, without a reload.
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-4zpt (Unit 1.5: Open and close a Panel)

## Summary of Changes

- `ApiStatus/health.ts`: the shared health check as a module of signals (`health$`, `checkHealth`, `checkHealthOnce`, `resetHealth`). One request at a time; a newer request drops the older answer; the last health stays while it asks again.
- `useApiHealth` reads it: the Landing badge asks once per page load, `OfflineNote` asks each time it appears.
- New `components/domain/OfflineNote` (an `<output>` status region, the note only while down), `offline.note` message in `i18n/en/offline.json`, rendered by the Chat with me and Contact pages.
- Tests first against a mocked `fetchHealth`: health module, ApiStatus, OfflineNote, both pages, messages. `frontend.md` names the new module.
- The E2E scenario for the offline note stays in portfolio-3sox.
