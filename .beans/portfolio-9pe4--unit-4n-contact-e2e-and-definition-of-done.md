---
# portfolio-9pe4
title: 'Unit 4.N: Contact E2E and Definition of Done'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-19T13:42:26Z
updated_at: 2026-11-22T04:49:10Z
parent: portfolio-yxux
blocked_by:
    - portfolio-0hxh
    - portfolio-zmw2
    - portfolio-8gew
    - portfolio-dhsr
    - portfolio-m1de
---

## Parent

portfolio-yxux Unit 4: Contact. Spec: portfolio-tn1x (Unit 4: Contact spec) and the Unit 4 section of docs_src/specs/units.md. Vocabulary: CONTEXT.md. ADR 0005.

## What to build

Stage N: the whole Contact feature in one E2E pass on the frontend build, with /api/* stubbed by Playwright routes along the contract (no running backend, by the Owner's decision). It checks the spec's Definition of Done and brings the epic's body up to date with the stage list.

## Acceptance criteria

- [x] E2E covers desktop and mobile order, a sent request, field errors, 422, 400, 502 with countdown, offline
- [x] Definition of Done checked: a sent Contact request reaches the Owner by email and nothing is stored; bots rejected (floods: the rate limiter, Unit 8); unit, component and E2E tests green
- [x] portfolio-yxux body updated with the stage list
- [x] scripts/verify.sh GREEN

## Blocked by

- portfolio-0hxh Unit 4.2: Contact Panel layout
- portfolio-zmw2 Unit 4.3: Send a Contact request
- portfolio-8gew Unit 4.4: Field feedback
- portfolio-dhsr Unit 4.5: Failure and offline states
- portfolio-m1de Unit 4.6: Human check and honeypot


## Summary of Changes

No code change was needed: the earlier stages already left `contact.feature` covering the whole flow. Checked on 2026-11-22:

- E2E (`pnpm --dir frontend e2e`): 119 of 119 scenarios pass. Contact covers desktop (1280, 1000) and phone (390) order, a sent request, field errors, 422, 400, 502 with the 10 s countdown, an unfetchable challenge, a network failure, the honeypot and offline.
- Definition of Done: the backend tests (`backend/tests/contact/`) show a sent request calls the mailer once, 422 per rule, 400 on a failed human check, 502 when the mailer raises, and a filled honeypot gets a silent 204 with nothing sent. No storage exists in `backend/src`. Floods are the rate limiter, Unit 8 (portfolio-vd9x).
- portfolio-yxux already lists every stage and its Unit 8 move of the rate limiter; no edit needed.
- `scripts/verify.sh`: GREEN.
