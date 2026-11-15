---
# portfolio-04f9
title: 'Unit 2.N: About E2E'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-12T16:19:41Z
updated_at: 2026-11-15T15:34:57Z
parent: portfolio-18oz
blocked_by:
    - portfolio-ajvs
    - portfolio-ftdn
    - portfolio-fbzp
    - portfolio-xjur
    - portfolio-6x9j
---

## Parent

portfolio-18oz (Unit 2: About). Design: the Unit 2 section of `docs_src/specs/units.md` (fully decided in the 2026-11-12 grilling, rounds noted in the epic). Vocabulary: `CONTEXT.md` (Headline, Bio, Role, Hobby, CV). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

Cucumber + Playwright E2E for About against the real frontend build.

## Acceptance criteria

- [x] Opening `/about` shows the top card with the greeting, the six badges (each with its `title`), the photo, and the lower cards in order: Bio, Roles (five, newest first), Education, Languages and Hobbies
- [x] Desktop: the badges sit on one row clear of the close button; phone: badges, photo, then the rest
- [x] The CV button downloads `alexander-durnev-cv-en.pdf`
- [x] The final content is in place (no placeholder text)
- [x] `pnpm --dir frontend e2e` green; `scripts/verify.sh` GREEN

## Blocked by

- portfolio-ajvs
- portfolio-ftdn
- portfolio-fbzp
- portfolio-xjur
- portfolio-6x9j

## Summary of Changes

- `frontend/e2e/features/about.feature` + `steps/about.steps.ts`: 8 scenarios. Top card greeting and photo (decoded), six badges with `text` and `title`, desktop one-line badge row clear of the close button, lower cards in order, five Roles newest first, phone order (badges, photo, Bio), CV download (filename and `%PDF-` bytes), no placeholder text (word-boundary match; "Autodoc" contains "todo").
- `support/world.ts`: `download` field for the CV scenario.
- Style details no longer pinned to exact values (Owner decision: they change often). Mobile Stripes: "taller than their title line" instead of "title plus 1.5rem" (fixes the failure left by the 1.8rem token). The badge-row border middle reads the border thickness from CSS. Explore dots and title lift: inset, centred, past the left border, above the middle, no 2%/4%/tenth.
- `pnpm --dir frontend e2e`: 89/89. `scripts/verify.sh`: GREEN.
