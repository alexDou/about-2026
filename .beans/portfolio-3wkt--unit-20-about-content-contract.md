---
# portfolio-3wkt
title: 'Unit 2.0: About content contract'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-12T16:19:41Z
updated_at: 2026-11-12T16:19:41Z
parent: portfolio-18oz
---

## Parent

portfolio-18oz (Unit 2: About). Design: the Unit 2 section of `docs_src/specs/units.md` (fully decided in the 2026-11-12 grilling, rounds noted in the epic). Vocabulary: `CONTEXT.md` (Headline, Bio, Role, Hobby, CV). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

Stage 0 for About: lock the shape of About's content before any feature code. The About content TS type and an English message file for the About area (`i18n/en/about.json`), with placeholder text where the content grilling (2.1) hasn't delivered yet, and a test validating the JSON against the type.

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] An About message file exists and is merged into the English messages; ids prefixed `about.`
- [ ] The content type covers: name, Headline, credo, Bio, the six badges (text and `title` each), five Roles (title, company, period, place, text, technologies), Education (degree, school, place, year, business sentence), Languages (name, word level, CEFR level), Hobbies (name, a few words), the CV link label
- [ ] A test locks the invariants: exactly six badges in the order Available Now, Full-time, Contract, Relocation, Remote work, AI ready; exactly five Roles, newest first; the four languages (Russian native, English C1, German B2, Spanish A2); every referenced message id exists and parses as ICU
- [ ] Placeholder messages pass the same test, so 2.3 to 2.5 can build on them
- [ ] The approved Bio and the badge texts and titles from the spec go in as final text
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- None (can start immediately)
