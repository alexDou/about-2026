---
# portfolio-63rn
title: 'Unit 3.6: Certificate view'
status: todo
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-18T06:44:16Z
parent: portfolio-4rt0
blocked_by:
    - portfolio-k6h6
    - portfolio-3q18
---

## Parent

portfolio-4rt0 (Unit 3: Skills). Design: the Unit 3 section of `docs_src/specs/units.md` (fully decided in the 2026-11-16 grilling). Vocabulary: `CONTEXT.md` (Skill, Skill group, Skill subgroup, Certificate). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The Certificate view: inside an open Skill's overview, a link per Certificate (labelled by its issuer when the Skill has two) opens a dialog with the certificate image, title, issuer, month and year, the TestDome ranking and "Verify at the issuer" (none for TestDome or CSS Wizard). Certificates show only when the Skill is open; there is no separate Certificates list.

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] The dialog opens and closes declaratively with Invoker Commands (`commandfor` + `command="show-modal"` / `command="close"`); no `showModal()` call, no ref. Check first that Octane passes the attributes through
- [ ] A quick entry and exit animation in CSS (`@starting-style`); none with reduced motion
- [ ] Escape closes only the dialog, never the Expanded panel behind it (adjust `useEscapeKey` as needed)
- [ ] The image loads as AVIF with a WebP fallback and has alt text
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-k6h6
- portfolio-3q18
