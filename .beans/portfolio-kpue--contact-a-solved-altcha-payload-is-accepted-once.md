---
# portfolio-kpue
title: 'Contact: a solved ALTCHA payload is accepted once'
status: todo
type: task
created_at: 2026-11-22T06:08:31Z
updated_at: 2026-11-22T06:08:31Z
parent: portfolio-fg5a
---

Review of Unit 4 (2026-11-22): `backend/src/app/contact/human_check.py` checks signature, expiry and solution only, so one solved payload can be replayed for CHALLENGE_LIFETIME (5 min) and each replay sends an email. COST 2000 and keyPrefix 00 make the proof of work cheap too.

## What to build

- [ ] Each challenge nonce is accepted once (a Durable Object table of used nonces, built with the Unit 8 deploy, portfolio-vd9x), and `human_check.py` says so
- [ ] Re-check COST and keyPrefix against the Worker's CPU budget
- [ ] Test: a payload used twice is rejected the second time
- [ ] The `HumanCheck` protocol docstring in `backend/src/app/dependencies.py` says `verify` "never raises", but `human_check.py` raises `ValueError` when `ALTCHA_HMAC_KEY` is empty or missing: make the docstring say so, or have the handlers answer a logged static error instead of an uncaught 500 (the Owner decides)
- [ ] scripts/verify.sh GREEN
