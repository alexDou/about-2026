---
# portfolio-dhsr
title: 'Unit 4.5: Failure and offline states'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-19T13:42:25Z
updated_at: 2026-11-19T13:42:25Z
parent: portfolio-yxux
blocked_by:
    - portfolio-zmw2
---

## Parent

portfolio-yxux Unit 4: Contact. Spec: portfolio-tn1x (Unit 4: Contact spec) and the Unit 4 section of docs_src/specs/units.md. Vocabulary: CONTEXT.md. ADR 0005.

## What to build

When sending fails, the Visitor gets the form back with everything they typed, a generic reason, and a 10-second countdown before Send works again. This covers a 502 (the email could not be sent) and a network failure. While the shared health check reports the backend down, the form is disabled beside Unit 1's offline note; the links and the Contact notice stay.

## Acceptance criteria

- [ ] POST /api/contact answers 502 when the mailer raises
- [ ] Failure message "Your request wasn't sent. Please try again in {seconds} s." with a visible countdown; submit locked for 10 s; values kept
- [ ] Network failure handled the same way
- [ ] Form disabled while the backend is down; links and Contact notice stay available
- [ ] Backend test with a raising mailer override; component tests with fake timers; E2E scenarios for a 502 with its countdown and for offline
- [ ] scripts/verify.sh GREEN

## Blocked by

- portfolio-zmw2 Unit 4.3: Send a Contact request
