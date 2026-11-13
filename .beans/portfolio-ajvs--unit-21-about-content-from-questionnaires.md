---
# portfolio-ajvs
title: 'Unit 2.1: About content from questionnaires'
status: completed
type: task
priority: normal
tags:
    - ready-for-human
created_at: 2026-11-12T16:19:41Z
updated_at: 2026-11-13T14:33:01Z
parent: portfolio-18oz
blocked_by:
    - portfolio-3wkt
---

## Parent

portfolio-18oz (Unit 2: About). Design: the Unit 2 section of `docs_src/specs/units.md` (fully decided in the 2026-11-12 grilling, rounds noted in the epic). Vocabulary: `CONTEXT.md` (Headline, Bio, Role, Hobby, CV). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The About content, written with the Owner. First a grilling session over five questionnaires, then drafts the Owner approves, then the final text in the About message file.

## Acceptance criteria

- [x] Questionnaires in `docs_src/about/`: `headline.md` (who the Owner is professionally, the target roles), `credo.md` (the line under the greeting: experience, passion for technology, team spirit, experimentation), `roles.md` (one section per Role, seeded with the CV facts: proudest work, scale, team, the Owner's part), `hobbies.md` (each Hobby with a few words), `education.md` (one business-level sentence on the product and business thinking the degree built)
- [x] Grilled with the Owner (grilling skill, numbered rounds), answers kept in the files
- [x] Drafts for Headline, credo, Hobbies and the Education sentence, approved by the Owner (the five Role texts moved to portfolio-hdd2 on 2026-11-13: the Owner rejected the agent's drafts)
- [x] The approved text (all but the Role texts, see portfolio-hdd2) replaces the placeholders in the About message file; the 2.0 test still passes
- [x] CV typos not carried over ("Commulative", "convertion", "Ukranian", "Reduction on"); the Owner is told so the new CV (portfolio-yhih) gets them right
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-3wkt

## Notes

- Questionnaires created in `docs_src/about/` (round-1 questions, CV facts as seeds, answers pending). Round 1 posted to the Owner in the session; the bean stays in-progress until the grilling, drafts and message file are done.

## Round 1 (2026-11-13)

Answered by the Owner and kept in `docs_src/about/*.md`, with drafts for every item. Awaiting approval; open points: school name, Web Vitals ownership, AES-256 key exchange wording, which four Hobbies, which credo option. The message file is untouched.

## Round 2 (2026-11-13)

Credo = the first two Bio sentences (Owner). Final text written into `about.json` (2.0 test passes, verify GREEN). Waiting for the Owner to approve the drafts, then tick the remaining items, add the summary, complete and commit.

## Round 3 (2026-11-13)

Bio cut to its three personal sentences, credo = the former first two (spec updated). Roles, Hobbies and Education reworded closer to the Owner input and more complete; Hobbies are now five (Technologies, Science, History and travel, Sport, Art): `ABOUT_HOBBY_NUMBERS` = 1..5, test added. Awaiting final approval.

## Summary of Changes

- Questionnaires in `docs_src/about/` (headline, credo, roles, hobbies, education) with the Owner's answers; `roles.md` holds only questions and his verbatim words.
- `about.json`: Headline "Senior Full-Stack Engineer and System Design Specialist", credo (the former first two Bio sentences), Bio cut to its three personal sentences, Education (degree, State University of Management, Moscow, 2002, one business sentence), five Hobbies (Technologies, Science, History and travel, Sport, Art), Role metadata and CV technologies lists.
- Contract: `ABOUT_HOBBY_NUMBERS` is 1..5; the 2.0 test pins the five Hobby names and the new Bio. Spec updated (credo, Bio).
- Role texts are not done: the Owner rejected the agent's drafts twice. Split into portfolio-hdd2 (handoff, with the Owner's style sample and open questions); 2.N waits for it. The Role `text` messages still hold the 2.0 placeholders.
- CV typos not carried over; the Owner is told so portfolio-yhih gets them right.
