---
# portfolio-63rn
title: 'Unit 3.6: Certificate view'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-16T09:50:04Z
updated_at: 2026-11-18T19:45:47Z
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

- [x] Tests written first and red, then green (TDD)
- [x] The dialog opens and closes declaratively with Invoker Commands (`commandfor` + `command="show-modal"` / `command="close"`); no `showModal()` call, no ref. Check first that Octane passes the attributes through
- [x] A quick entry and exit animation in CSS (`@starting-style`); none with reduced motion
- [x] Escape closes only the dialog, never the Expanded panel behind it (adjust `useEscapeKey` as needed)
- [x] The image loads as AVIF with a WebP fallback and has alt text
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-k6h6
- portfolio-3q18

## Summary of Changes

- New `components/domain/skills/skill-entry/certificate-view/` (`CertificateView`): a link button and its `<dialog>`, opened and closed by Invoker Commands (`commandfor` + `command="show-modal"` / `"close"`). Octane passes the attributes through (typecheck, unit test and a real-Chromium E2E confirm). No `showModal()`, no ref.
- The dialog shows the image (AVIF source, WebP fallback, alt from title and issuer, `loading="lazy"` so a closed dialog fetches nothing), title, issuer, month and year (UTC, year only where no month), the ranking, and "Verify at the issuer" where there is a link.
- Entry and exit in CSS: `@starting-style` plus `allow-discrete` transitions for the dialog and its backdrop; none under reduced motion.
- Escape: the dialog's `onKeyDown` stops the key at the dialog, so the Expanded panel's document listener never hears it; the browser's own cancel closes the dialog. `useEscapeKey` unchanged.
- `SkillEntry` renders the links under the overview text, inside the clipped, `inert` overview body: one Certificate is a "Certificate" link, two are labelled by their issuers (spec line updated in `docs_src/specs/units.md`). Skills with no Certificate show nothing.
- Messages: `skills.certificateLink`, `certificateClose`, `certificateVerify`, `certificateImageAlt`.
- E2E: `skills.feature` (open, Escape leaves the Panel open, close button). Unit tests first for the component, its stylesheet and `SkillEntry`.
