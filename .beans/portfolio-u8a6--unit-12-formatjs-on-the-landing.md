---
# portfolio-u8a6
title: 'Unit 1.2: FormatJS on the Landing'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-09T10:30:50Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-lz1t
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

Site text comes from FormatJS messages through our own thin, react-intl-style binding: an `IntlProvider` around the app and a shared `useIntl()` hook. The Landing is the first consumer: the logo's accessible label, the status badge text and the document title "A.Durnev portfolio".

## Acceptance criteria

- [ ] Unit and integration tests written first and red, then green (TDD, per the rules)
- [ ] The provider and hook format a message by id, with and without values; tests cover both.
- [ ] Formatting runs on `@formatjs/intl`; neither React nor react-intl is in the bundle.
- [ ] `useIntl()` is a shared hook; the provider wraps the app.
- [ ] The logo label, the status badge text and the document title come from messages; no hard-coded UI strings remain on the Landing.
- [ ] Existing Landing E2E scenarios that check changed text are updated, and `pnpm --dir frontend e2e` stays green.
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-lz1t (Unit 1.0: Board and message contracts)
