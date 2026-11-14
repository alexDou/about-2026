---
# portfolio-xjur
title: 'Unit 2.5: About lower cards'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-12T16:19:41Z
updated_at: 2026-11-14T16:34:52Z
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

- [x] Tests written first and red, then green (TDD)
- [x] Each card on `--panel-what-i-do` with `#25363a` text; section headings in Playfair Display
- [x] Bio: the approved text, two paragraphs (`bio.professional`, then `bio.personal`)
- [x] Roles: five, newest first; title, company, period, place, an optional intro, the highlights list (`AboutRole.intro` / `highlights`, each "what was done. My role: ..."), a technologies line
- [x] Education: the degree, school, place, year and the business sentence
- [x] Languages and Hobbies in one card: two columns on desktop, stacked on phones; Languages as "word (CEFR)", e.g. "English: fluent (C1)"; Hobbies with a few words each
- [x] All text from the About messages
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-3wkt
- portfolio-viuq

## Summary of Changes

- New shared UI chunks `components/ui/card` (article surface on `--panel-what-i-do`, `--text-on-light`) and `card-heading` (h2 in Playfair Display via `--font-greeting`).
- New domain chunks under `components/domain/about/`: `about-bio-card`, `about-roles-card` (with sub-component `role-entry`), `about-education-card`, `about-languages-hobbies-card` (two columns, stacked below 840px). Each declares its own props types; `AboutPage` passes the content in under the badges and top card.
- Content: `AboutContent` gained `headings`, `languageLines`, `technologiesLabel`, `roleLine` and `education.line`; matching messages added to `about.json` (headings, "Technologies:", language line with and without CEFR, role and education lines with the middle dot).
- Language levels lowercased in the messages (fluent, native, basic, good working knowledge) so the line reads "English: fluent (C1)" as the bean specifies.
- Section headings are my wording (Bio, Experience, Education, Languages, Hobbies): not Owner-approved text, confirm or change.
- Review (Standards and Spec axes): separators and label colon moved into messages, Languages and Hobbies card takes only its two headings, duplicate `aria-label` dropped. Left as is: `Card` and the top card still style the same surface twice (top card has its own ridge border; a follow-up could build it on `Card`); `role-entry` is tested through `AboutRolesCard`.
- `scripts/verify.sh` GREEN; `pnpm e2e` 77/77 green (run before the review fixes).
