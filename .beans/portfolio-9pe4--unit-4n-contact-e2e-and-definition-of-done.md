---
# portfolio-9pe4
title: 'Unit 4.N: Contact E2E and Definition of Done'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-19T13:42:26Z
updated_at: 2026-11-19T13:42:26Z
parent: portfolio-yxux
blocked_by:
    - portfolio-0hxh
    - portfolio-zmw2
    - portfolio-8gew
    - portfolio-dhsr
    - portfolio-m1de
    - portfolio-vd9x
---

## Parent

portfolio-yxux Unit 4: Contact. Spec: portfolio-tn1x (Unit 4: Contact spec) and the Unit 4 section of docs_src/specs/units.md. Vocabulary: CONTEXT.md. ADR 0005.

## What to build

Stage N: the whole Contact feature in one E2E pass on the frontend build, with /api/* stubbed by Playwright routes along the contract (no running backend, by the Owner's decision). It checks the spec's Definition of Done and brings the epic's body up to date with the stage list.

## Acceptance criteria

- [ ] E2E covers desktop and mobile order, a sent request, field errors, 422, 400, 429, 502 with countdown, offline
- [ ] Definition of Done checked: a sent Contact request reaches the Owner by email and nothing is stored; bots and floods rejected; unit, component and E2E tests green
- [ ] portfolio-yxux body updated with the stage list
- [ ] scripts/verify.sh GREEN

## Blocked by

- portfolio-0hxh Unit 4.2: Contact Panel layout
- portfolio-zmw2 Unit 4.3: Send a Contact request
- portfolio-8gew Unit 4.4: Field feedback
- portfolio-dhsr Unit 4.5: Failure and offline states
- portfolio-m1de Unit 4.6: Human check and honeypot
- portfolio-vd9x Unit 4.7: Rate limit
