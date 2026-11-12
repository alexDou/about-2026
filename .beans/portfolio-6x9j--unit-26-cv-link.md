---
# portfolio-6x9j
title: 'Unit 2.6: CV link'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-12T16:19:41Z
updated_at: 2026-11-12T16:19:41Z
parent: portfolio-18oz
blocked_by:
    - portfolio-fbzp
---

## Parent

portfolio-18oz (Unit 2: About). Design: the Unit 2 section of `docs_src/specs/units.md` (fully decided in the 2026-11-12 grilling, rounds noted in the epic). Vocabulary: `CONTEXT.md` (Headline, Bio, Role, Hobby, CV). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The CV download until portfolio-yhih ships the new CV: the 2026 PDF with the phone number removed, served from the site root, linked by the top card's button.

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] The phone number is truly removed from `support_files/about/A.Durnev-CV_2026.pdf` (redaction that deletes the text, e.g. PyMuPDF `apply_redactions`, not a box drawn over it); checked with `pdftotext`; the Owner looks at the result before it is committed
- [ ] Served as `frontend/public/cv/alexander-durnev-cv-en.pdf`
- [ ] The top card's CV button downloads it (`download` attribute, a label from the messages)
- [ ] portfolio-yhih notes that it replaces this file at the same path
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-fbzp
