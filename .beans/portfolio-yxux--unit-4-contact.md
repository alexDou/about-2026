---
# portfolio-yxux
title: 'Unit 4: Contact'
status: completed
type: epic
priority: normal
created_at: 2026-11-06T20:27:21Z
updated_at: 2026-11-22T04:51:01Z
parent: portfolio-4ur0
blocked_by:
    - portfolio-m9gt
---

Contact Panel: "Remote, worldwide", the LinkedIn and Xing links, the Contact notice and the Contact request form. A sent Contact request reaches the Owner by email and is never stored (ADR 0005). The API runs as a Python Worker on Cloudflare's free plan (ADR 0006). Spec: docs_src/specs/units.md#unit-4-contact (problem, solution, 47 user stories, decisions, out of scope).

## Stages

Child beans, in dependency order (each lists its blockers):

- portfolio-1b3v Unit 4.0a: Backend becomes a Python Worker
- portfolio-m7rt Unit 4.0: Contact contracts
- portfolio-trgn Unit 4.1: Shared profile links with Xing
- portfolio-0hxh Unit 4.2: Contact Panel layout
- portfolio-zmw2 Unit 4.3: Send a Contact request
- portfolio-8gew Unit 4.4: Field feedback
- portfolio-dhsr Unit 4.5: Failure and offline states
- portfolio-m1de Unit 4.6: Human check and honeypot
- portfolio-9pe4 Unit 4.N: Contact E2E and Definition of Done

Also under this epic: portfolio-pcnc Opengrep backend rules and agent docs follow the Worker.

The rate limiter (was 4.7) moved to Unit 8 on 2026-11-21 (portfolio-vd9x): it is built with the Cloudflare deploy, so this epic ships without it and without the 429 message.

Design decided in the 2026-11-19 grilling, amended 2026-11-20 for ADR 0006 (the Unit 4 section of `docs_src/specs/units.md`). The epic is done when every child bean is completed.


## Summary of Changes

Contact Panel shipped without the rate limiter and the 429 message (Unit 8, portfolio-vd9x): the shared profile links with Xing, the layout, the Contact request form with field feedback, failure and offline states, the ALTCHA human check and honeypot, the Python Worker backend (route table, handlers, mailer, human check) and the contracts locked on both sides. E2E 119 of 119 and `scripts/verify.sh` GREEN on 2026-11-22.
