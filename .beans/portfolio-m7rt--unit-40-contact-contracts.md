---
# portfolio-m7rt
title: 'Unit 4.0: Contact contracts'
status: in-progress
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-19T13:42:25Z
updated_at: 2026-11-20T12:53:14Z
parent: portfolio-yxux
blocked_by:
    - portfolio-1b3v
---

## Parent

portfolio-yxux Unit 4: Contact. Spec: portfolio-tn1x (Unit 4: Contact spec) and the Unit 4 section of docs_src/specs/units.md. Vocabulary: CONTEXT.md. ADR 0005.

## What to build

The Contact request and challenge contracts, locked on both sides before any feature uses them. The frontend gets one zod schema that holds the field rules, with the ContactRequest type derived from it, and the backend a Pydantic model that mirrors fields and limits. The challenge response shape and the status codes are fixed. The API client gains a POST helper beside its GET helper.

## Acceptance criteria

- [ ] zod schema: name required ≤ 80, company required ≤ 100, position optional ≤ 120 (one line), contact optional ≤ 200, altcha required, website (honeypot) optional; trimmed, control characters stripped, whitespace only counts as empty
- [ ] ContactRequest type derived from the schema; challenge response type
- [ ] Pydantic model with identical field names, optionality and limits, plus the challenge response model
- [ ] Status codes documented in the contract: 204 sent, 422 invalid fields, 400 failed human check, 429 limit reached, 502 email not sent
- [ ] Frontend contract test: the schema accepts and rejects along every rule; the POST helper sends the JSON body and parses errors (mocked fetch)
- [ ] Backend contract test: the models validate and reject along the same rules
- [ ] scripts/verify.sh GREEN

## Blocked by

- portfolio-1b3v Unit 4.0a: Backend becomes a Python Worker
