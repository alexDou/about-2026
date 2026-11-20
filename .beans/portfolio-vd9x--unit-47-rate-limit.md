---
# portfolio-vd9x
title: 'Unit 4.7: Rate limit'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-19T13:42:26Z
updated_at: 2026-11-19T13:42:26Z
parent: portfolio-yxux
blocked_by:
    - portfolio-zmw2
---

## Parent

portfolio-yxux Unit 4: Contact. Spec: portfolio-tn1x (Unit 4: Contact spec) and the Unit 4 section of docs_src/specs/units.md. Vocabulary: CONTEXT.md. ADR 0005.

## What to build

Floods are refused. POST /api/contact allows 5 requests per 15 minutes per IP and 100 a day site-wide; past either, it answers 429 and the form shows "Too many requests from your connection. Please try again in a few minutes." The client IP is CF-Connecting-IP. Durable Objects keep exact counts (ADR 0006): one per hashed client IP and one site-wide. Each request first deletes timestamps older than its window with one SQL statement, then counts. No alarms; the clock is injected.

## Acceptance criteria

- [ ] Per IP: the 6th request within 15 minutes gets 429, and it passes again once the window moves on
- [ ] Site-wide: the 101st request of a day gets 429
- [ ] Client IP from CF-Connecting-IP, hashed before it keys a Durable Object
- [ ] Durable Objects hold only timestamps inside their window; no raw IP is stored
- [ ] The form shows the 429 message
- [ ] Limiter tests with an injected clock; endpoint tests with the Durable Object stub mocked; component test for the message; E2E scenario with a stubbed 429
- [ ] Durable Object logic is a plain Python class tested with its SQL storage mocked; only the thin Durable Object wrapper imports the Workers runtime
- [ ] scripts/verify.sh GREEN

## Blocked by

- portfolio-zmw2 Unit 4.3: Send a Contact request
