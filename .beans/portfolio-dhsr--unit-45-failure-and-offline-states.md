---
# portfolio-dhsr
title: 'Unit 4.5: Failure and offline states'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-19T13:42:25Z
updated_at: 2026-11-20T14:20:54Z
parent: portfolio-yxux
blocked_by:
    - portfolio-zmw2
---

## Parent

portfolio-yxux Unit 4: Contact. Spec: portfolio-tn1x (Unit 4: Contact spec) and the Unit 4 section of docs_src/specs/units.md. Vocabulary: CONTEXT.md. ADR 0005.

## What to build

When sending fails, the Visitor gets the form back with everything they typed, a generic reason, and a 10-second countdown before Send works again. This covers a 502 (the email could not be sent) and a network failure. While the shared health check reports the backend down, the form is disabled beside Unit 1's offline note; the links and the Contact notice stay.

## Acceptance criteria

- [x] POST /api/contact answers 502 when the mailer raises
- [x] Failure message "Your request wasn't sent. Please try again in {seconds} s." with a visible countdown; submit locked for 10 s; values kept
- [x] Network failure handled the same way
- [x] Form disabled while the backend is down; links and Contact notice stay available
- [x] Backend test with a raising mailer override; component tests with fake timers; E2E scenarios for a 502 with its countdown and for offline
- [x] scripts/verify.sh GREEN

## Blocked by

- portfolio-zmw2 Unit 4.3: Send a Contact request

## Summary of Changes

- 502 on a raising mailer was built and tested in 4.3 (`tests/contact/test_handlers.py`, `test_502_when_the_mailer_cannot_send`); nothing new on the backend.
- A request that is not sent (502, 400, any other status, a network failure: outcome `failed`) brings the form back with every typed value, the notice "Your request wasn't sent. Please try again in {seconds} s." and Send locked for `RETRY_SECONDS` (10). Afterwards the notice reads "...Please try again." and Send works. `useCountdown` (one timeout per second, cleaned up) in `contact-form/hooks/use-countdown/`; `useContactForm` returns `retryIn` and refuses a submit while it runs.
- With the shared health reporting the backend down (`useApiHealth`), the fieldset and Send are disabled and what was typed is kept; the links and the Contact notice are untouched. `OfflineNote` stays between the heading and the band.
- Messages `contact.form.failed` and `failedNow`.
- Tests: component tests with fake timers (message, lock, countdown, retry, no submit during the lock, offline and recovered); E2E scenarios for a 502 with its countdown, a network failure and the offline form. `scripts/verify.sh` GREEN; E2E 111/111.
