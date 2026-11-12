---
# portfolio-04f9
title: 'Unit 2.N: About E2E'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-12T16:19:41Z
updated_at: 2026-11-12T16:19:41Z
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

- [ ] Opening `/about` shows the top card with the greeting, the six badges (each with its `title`), the photo, and the lower cards in order: Bio, Roles (five, newest first), Education, Languages and Hobbies
- [ ] Desktop: the badges sit on one row clear of the close button; phone: badges, photo, then the rest
- [ ] The CV button downloads `alexander-durnev-cv-en.pdf`
- [ ] The final content is in place (no placeholder text)
- [ ] `pnpm --dir frontend e2e` green; `scripts/verify.sh` GREEN

## Blocked by

- portfolio-ajvs
- portfolio-ftdn
- portfolio-fbzp
- portfolio-xjur
- portfolio-6x9j
