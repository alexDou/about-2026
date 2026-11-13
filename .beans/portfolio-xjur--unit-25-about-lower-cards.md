---
# portfolio-xjur
title: 'Unit 2.5: About lower cards'
status: todo
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-12T16:19:41Z
updated_at: 2026-11-13T17:51:06Z
parent: portfolio-18oz
blocked_by:
    - portfolio-3wkt
    - portfolio-viuq
---

## Parent

portfolio-18oz (Unit 2: About). Design: the Unit 2 section of `docs_src/specs/units.md` (fully decided in the 2026-11-12 grilling, rounds noted in the epic). Vocabulary: `CONTEXT.md` (Headline, Bio, Role, Hobby, CV). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The cards below the top card, in order: Bio; Roles; Education; Languages and Hobbies.

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] Each card on `--panel-what-i-do` with `#25363a` text; section headings in Playfair Display
- [ ] Bio: the approved text, two paragraphs (`bio.professional`, then `bio.personal`)
- [ ] Roles: five, newest first; title, company, period, place, an optional intro, the highlights list (`AboutRole.intro` / `highlights`, each "what was done. My role: ..."), a technologies line
- [ ] Education: the degree, school, place, year and the business sentence
- [ ] Languages and Hobbies in one card: two columns on desktop, stacked on phones; Languages as "word (CEFR)", e.g. "English: fluent (C1)"; Hobbies with a few words each
- [ ] All text from the About messages
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-3wkt
- portfolio-viuq
