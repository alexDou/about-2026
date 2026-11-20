---
# portfolio-m1de
title: 'Unit 4.6: Human check and honeypot'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-19T13:42:26Z
updated_at: 2026-11-19T13:42:26Z
parent: portfolio-yxux
blocked_by:
    - portfolio-zmw2
    - portfolio-dhsr
---

## Parent

portfolio-yxux Unit 4: Contact. Spec: portfolio-tn1x (Unit 4: Contact spec) and the Unit 4 section of docs_src/specs/units.md. Vocabulary: CONTEXT.md. ADR 0005.

## What to build

Bots are stopped without bothering the Visitor. GET /api/contact/challenge hands out an ALTCHA challenge signed with ALTCHA_HMAC_KEY; the ALTCHA widget in the form solves it invisibly on submit and sends the payload with the request. The backend verifies it and answers 400 when it fails, which the form shows as a failure (message and countdown). A hidden honeypot field, when filled, gets a silent 204 and nothing is sent.

## Acceptance criteria

- [ ] GET /api/contact/challenge returns a challenge matching the contract
- [ ] ALTCHA widget (npm altcha) in the form: invisible, solves on submit, no third party, no cookies
- [ ] Backend verifies the payload with the altcha library (pure Python, loads in Pyodide) behind a human-check module passed to the handler; 400 on a failed, tampered or expired payload
- [ ] 400 shown as the generic failure with the countdown
- [ ] Honeypot field hidden from Visitors and assistive tech; filled → silent 204, mailer not called
- [ ] Order in the router: honeypot, field validation, rate limit slot reserved for 4.7, human check, mail
- [ ] Human-check tests with a payload solved by the library's own solver and a tampered one; endpoint tests with the human check overridden; component tests with the widget mocked along its contract; E2E with the challenge stubbed
- [ ] scripts/verify.sh GREEN

## Blocked by

- portfolio-zmw2 Unit 4.3: Send a Contact request
- portfolio-dhsr Unit 4.5: Failure and offline states
