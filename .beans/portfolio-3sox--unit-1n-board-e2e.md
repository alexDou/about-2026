---
# portfolio-3sox
title: 'Unit 1.N: Board E2E'
status: todo
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-11T11:11:53Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-1syg
    - portfolio-t6ex
    - portfolio-402i
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

Cucumber + Playwright scenarios against the production build prove the Unit 1 flows end to end (Stage Final).

## Acceptance criteria

- [ ] Each of the seven URLs renders the right state on a direct visit.
- [ ] Back/Forward walk through Landing → Board → Panel → another Panel → close.
- [ ] An unknown path lands on `/`; a trailing slash is dropped.
- [ ] The entrance runs whenever the Board appears: after the logo click, on a direct `/explore` visit, after a reload.
- [ ] Expanding from a Stripe works; the close button and Escape restore the default Board.
- [ ] On a mobile viewport the Panels are rows and the Stripes are title-height rows.
- [ ] With the backend unreachable, Chat with me and Contact show the offline note.
- [ ] With reduced motion emulated, state changes render instantly.
- [ ] With motion on, open, close and switch run as View Transitions: the transition types and the animation timings per pseudo-element (moved from portfolio-2dsc).
- [ ] `pnpm --dir frontend e2e` green
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-1syg (Unit 1.6: Expand and collapse sequences)
- portfolio-t6ex (Unit 1.7: Board entrance)
- portfolio-402i (Unit 1.8: Backend status in Chat with me and Contact)
