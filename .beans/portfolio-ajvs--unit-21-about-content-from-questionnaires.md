---
# portfolio-ajvs
title: 'Unit 2.1: About content from questionnaires'
status: todo
type: task
tags:
    - ready-for-human
created_at: 2026-11-12T16:19:41Z
updated_at: 2026-11-12T16:19:41Z
parent: portfolio-18oz
blocked_by:
    - portfolio-3wkt
---

## Parent

portfolio-18oz (Unit 2: About). Design: the Unit 2 section of `docs_src/specs/units.md` (fully decided in the 2026-11-12 grilling, rounds noted in the epic). Vocabulary: `CONTEXT.md` (Headline, Bio, Role, Hobby, CV). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The About content, written with the Owner. First a grilling session over five questionnaires, then drafts the Owner approves, then the final text in the About message file.

## Acceptance criteria

- [ ] Questionnaires in `docs_src/about/`: `headline.md` (who the Owner is professionally, the target roles), `credo.md` (the line under the greeting: experience, passion for technology, team spirit, experimentation), `roles.md` (one section per Role, seeded with the CV facts: proudest work, scale, team, the Owner's part), `hobbies.md` (each Hobby with a few words), `education.md` (one business-level sentence on the product and business thinking the degree built)
- [ ] Grilled with the Owner (grilling skill, numbered rounds), answers kept in the files
- [ ] Drafts for Headline, credo, five Role texts, Hobbies and the Education sentence, approved by the Owner
- [ ] The approved text replaces the placeholders in the About message file; the 2.0 test still passes
- [ ] CV typos not carried over ("Commulative", "convertion", "Ukranian", "Reduction on"); the Owner is told so the new CV (portfolio-yhih) gets them right
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-3wkt
