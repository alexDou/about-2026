---
# portfolio-m1de
title: 'Unit 4.6: Human check and honeypot'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-19T13:42:26Z
updated_at: 2026-11-21T15:30:42Z
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

- [x] GET /api/contact/challenge returns a challenge matching the contract
- [x] ALTCHA widget (npm altcha) in the form: invisible, solves on submit, no third party, no cookies
- [x] Backend verifies the payload with the altcha library (pure Python, loads in Pyodide) behind a human-check module passed to the handler; 400 on a failed, tampered or expired payload
- [x] 400 shown as the generic failure with the countdown
- [x] Honeypot field hidden from Visitors and assistive tech; filled → silent 204, mailer not called
- [x] Order in the router: honeypot, field validation, rate limit slot reserved for 4.7, human check, mail
- [x] Human-check tests with a payload solved by the library's own solver and a tampered one; endpoint tests with the human check overridden; component tests with the widget mocked along its contract; E2E with the challenge stubbed
- [x] scripts/verify.sh GREEN

## Blocked by

- portfolio-zmw2 Unit 4.3: Send a Contact request
- portfolio-dhsr Unit 4.5: Failure and offline states

## Summary of Changes

- Backend: `GET /api/contact/challenge` (ALTCHA v2, PBKDF2/SHA-256, 5 min life, `no-store`); `contact/human_check.py` (`AltchaHumanCheck` behind the `HumanCheck` protocol in `Dependencies`); `POST /api/contact` order honeypot, fields (422), rate-limit slot for 4.7 (comment), human check (400), mail. A filled honeypot gets a silent 204. `altcha` added to pyproject and `pylock.toml`.
- Frontend: `<altcha-widget auto="onsubmit" display="invisible">` in `ContactForm`, hidden `website` honeypot (`hidden` + `aria-hidden`), `altcha` 3.7.0 pinned. Each attempt gets a new widget (a payload is used once); a failed solve, a 400 or a challenge fetch error show the generic failure with the countdown.
- Tests: human-check tests with the library solver, tampered, expired, wrong-key, malformed payloads; endpoint tests with the human check mocked; component tests with a fake widget along the real contract (`_specs_/fake-altcha-widget.ts`); E2E runs the real widget against a stubbed challenge.

## Notes

- A solved payload is stateless on the backend: it verifies repeatedly until it expires (5 min). ADR 0005 rules out a nonce store, so the rate limit (4.7) bounds replay.
- `ContactRequest.altcha` has no `max_length`; a size cap on both sides (contract change) is a follow-up.
- The real widget takes the first submit before field validation, so an invalid form still solves once; the payload is then discarded.
- `AltchaHumanCheck` checks `ALTCHA_HMAC_KEY` where it is used, so a missing secret fails only the Contact routes, not `/api/health`.
- The test fake and one E2E step use imperative DOM code (listener, `evaluate`); test scaffolding only, flagged to the Owner.
- PBKDF2 `COST` and CPU budget under Pyodide are Unit 8 checks.
