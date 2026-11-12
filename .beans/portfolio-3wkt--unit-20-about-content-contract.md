---
# portfolio-3wkt
title: 'Unit 2.0: About content contract'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-12T16:19:41Z
updated_at: 2026-11-12T16:53:46Z
parent: portfolio-18oz
---

## Parent

portfolio-18oz (Unit 2: About). Design: the Unit 2 section of `docs_src/specs/units.md` (fully decided in the 2026-11-12 grilling, rounds noted in the epic). Vocabulary: `CONTEXT.md` (Headline, Bio, Role, Hobby, CV). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

Stage 0 for About: lock the shape of About's content before any feature code. The About content TS type and an English message file for the About area (`i18n/en/about.json`), with placeholder text where the content grilling (2.1) hasn't delivered yet, and a test validating the JSON against the type.

## Acceptance criteria

- [x] Tests written first and red, then green (TDD)
- [x] An About message file exists and is merged into the English messages; ids prefixed `about.`
- [x] The content type covers: name, Headline, credo, Bio, the six badges (text and `title` each), five Roles (title, company, period, place, text, technologies), Education (degree, school, place, year, business sentence), Languages (name, word level, CEFR level), Hobbies (name, a few words), the CV link label
- [x] A test locks the invariants: exactly six badges in the order Available Now, Full-time, Contract, Relocation, Remote work, AI ready; exactly five Roles, newest first; the four languages (Russian native, English C1, German B2, Spanish A2); every referenced message id exists and parses as ICU
- [x] Placeholder messages pass the same test, so 2.3 to 2.5 can build on them
- [x] The approved Bio and the badge texts and titles from the spec go in as final text
- [x] `scripts/verify.sh` GREEN

## Blocked by

- None (can start immediately)

## Summary of Changes

- `frontend/src/pages/AboutPage/content/` (new chunk inside the page): `config.ts` (badge kinds, Role, language and Hobby numbers), `types.ts` (`AboutContent` and parts, all fields are `MessageId`s), `content.ts` (`ABOUT_CONTENT`, which message each piece reads), `index.ts`, and `_specs_/content.test.ts`.
- `frontend/src/i18n/en/about.json` (new, FormatJS AST), merged in `messages.ts`; the i18n test now expects the `about` file.
- Final text: name, approved Bio, the six badge texts and titles, the four languages with levels, the CV label. Everything else is a bracketed placeholder for 2.1 (Headline, credo, five Roles, Education, Hobbies).
- The test locks: six badges in order, five Roles by position (Role 1 is the newest), the four languages with levels (Russian has no CEFR level), every referenced id exists and formats, and every `about.*` message is used.
- Decisions: `technologies` is one comma-separated message per Role; four Hobby placeholders (2.1 may change the count in `config.ts`); badge faces use the reference images' uppercase text.
- Review fixes: dropped the `as MessageId` cast on language CEFR ids and the redundant assertions.
