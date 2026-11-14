---
# portfolio-6x9j
title: 'Unit 2.6: CV link'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-12T16:19:41Z
updated_at: 2026-11-14T17:35:03Z
parent: portfolio-18oz
blocked_by:
    - portfolio-fbzp
---

## Parent

portfolio-18oz (Unit 2: About). Design: the Unit 2 section of `docs_src/specs/units.md` (fully decided in the 2026-11-12 grilling, rounds noted in the epic). Vocabulary: `CONTEXT.md` (Headline, Bio, Role, Hobby, CV). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The CV download until portfolio-yhih ships the new CV: the 2026 PDF with the phone number removed, served from the site root, linked by the top card's button.

## Acceptance criteria

- [x] Tests written first and red, then green (TDD)
- [x] The phone number is truly removed from `support_files/about/A.Durnev-CV_2026.pdf` (redaction that deletes the text, e.g. PyMuPDF `apply_redactions`, not a box drawn over it); checked with `pdftotext`; the Owner looks at the result before it is committed
- [x] Served as `frontend/public/cv/alexander-durnev-cv-en.pdf`
- [x] The top card's CV button downloads it (`download` attribute, a label from the messages)
- [x] portfolio-yhih notes that it replaces this file at the same path
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-fbzp

## Summary of Changes

- Redacted the phone line from the 2026 CV with PyMuPDF `apply_redactions` (text deleted, not covered); `pdftotext` finds no number and differs from the original only by that line. Owner reviewed and accepted the result. Served as `frontend/public/cv/alexander-durnev-cv-en.pdf`.
- About content: `cvLabel` became `cv: { label, url }`; the top card renders the CV as `<a href download>` with hover and focus-visible styles.
- The Stripe filters (App.test.ts, e2e panels steps) now skip links with `download`, since the CV href also starts with `/`.
- Tests: top card link and download attribute; content test that the CV file exists in `public/` (resolved from the test file, not the cwd).
- Review: standards and spec reviews found no blockers; applied the test-path and hover/focus remarks. Left as is: duplicated `download` filter in unit vs E2E harness, and the CV download E2E step (belongs to Unit 2.N).
