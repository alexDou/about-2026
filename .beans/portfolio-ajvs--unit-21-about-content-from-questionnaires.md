---
# portfolio-ajvs
title: 'Unit 2.1: About content from questionnaires'
status: completed
type: task
priority: normal
tags:
    - ready-for-human
created_at: 2026-11-12T16:19:41Z
updated_at: 2026-11-13T17:51:21Z
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
- [x] Drafts for Headline, credo, five Role texts, Hobbies and the Education sentence, approved by the Owner
- [x] The approved text replaces the placeholders in the About message file; the 2.0 test still passes
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
- Roles: `AboutRole` is an optional `intro` plus `highlights` (read from the `about.role.N.highlight.M` messages), each "what was done. My role: ..."; the 2.0 test pins the order and the Tipico intro, and the 2.5 bean notes the list rendering. The five Roles are written from the Owner's own versions (answers verbatim in `roles.md`); no placeholders are left in the About messages. A separate handoff bean was used for a while and deleted once the Roles were approved.
- CV typos not carried over; the Owner is told so portfolio-yhih gets them right.


## Round 8 (2026-11-13): review

An Opus review of the About text; answers verbatim in `docs_src/about/roles.md`, `bio.md` and `headline.md`.

- [x] Approved review fixes applied to `about.json` (Bio, Roles 1 to 5), the 2.0 test updated first
- [x] Professional summary for the Bio drafted and approved
- [x] Tipico "Frontend" bullet and Zovolt "Real time" sentence approved
- [x] Badge titles and the Technologies Hobby wording decided
- [x] Spec Bio line and portfolio-yhih CV claims updated
- [x] `scripts/verify.sh` GREEN


## Summary of Changes (review, rounds 8 to 10)

- Bio: two messages, `about.bio.professional` (new summary: full stack, the fundamentals, business requirements, AI ready) and `about.bio.personal` (no birth date); `AboutBio` type, the 2.0 test pins both. The 2.5 bean renders them as two paragraphs.
- Roles: Autodoc title "Senior Frontend Developer · Technical Lead", bullets reordered, UI component libraries, the proposal and Results cause; Tipico small team, the visitor-facing app, "in every Tipico shop"; Zovolt public-key auth, End-to-end security, WebRTC browser reach, IoT folded into My role; Demokratech county council; Role 5 "Full-Stack Web Developer", "Self-employed", PHP. "Full-Stack" and "My role:" throughout.
- Badges: Available Now "Can start immediately.", Relocation "Open to relocation anywhere, for the right offer." (spec and test). Hobby "on this very site".
- The Owner's answers verbatim in `docs_src/about/` (`bio.md` new); the CV claims to match appended to portfolio-yhih.
