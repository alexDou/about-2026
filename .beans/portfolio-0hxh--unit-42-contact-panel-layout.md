---
# portfolio-0hxh
title: 'Unit 4.2: Contact Panel layout'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-19T13:42:25Z
updated_at: 2026-11-20T13:44:42Z
parent: portfolio-yxux
blocked_by:
    - portfolio-trgn
---

## Parent

portfolio-yxux Unit 4: Contact. Spec: portfolio-tn1x (Unit 4: Contact spec) and the Unit 4 section of docs_src/specs/units.md. Vocabulary: CONTEXT.md. ADR 0005.

## What to build

Opening /contact shows the Contact Panel's layout: the heading on the Panel's #5c8b70, then one #d1dcd9 band with two columns. The left column holds "Remote, worldwide" with a globe icon, the LinkedIn and Xing links (ring look) between two rules, and the Contact notice; the right column is reserved for the form. Below 840px one CSS grid reorders the same markup: the remote line and the links, then the form, then the Contact notice above the submit button.

## Acceptance criteria

- [x] Heading on the Panel colour; the band in #d1dcd9 with #25363a text
- [x] Left column: "Remote, worldwide", LinkedIn (https://www.linkedin.com/in/a-doo/) and Xing (https://www.xing.com/profile/Alexander_Doo) in that order, the Contact notice
- [x] Contact notice text: "I use these details only to reply to your request. They reach me by email and are not stored on this site or passed on to anyone."
- [x] All text in a Contact message file (en), ids prefixed by area
- [x] Amethysta for content, Playfair Display for headings
- [x] Desktop two columns; below 840px the grid order from the spec, same markup
- [x] The page owns its content and passes it down; the layout lives in a Contact domain component
- [x] Page and component tests: composition, palette, layout mode; E2E scenario opening /contact on desktop and mobile
- [x] scripts/verify.sh GREEN

## Blocked by

- portfolio-trgn Unit 4.1: Shared profile links with Xing

## Summary of Changes

- `components/domain/contact/contact-panel/ContactPanel`: one `--panel-what-i-do` band, a grid in two columns (remote line with a globe, the ring-look LinkedIn and Xing links between two rules, the Contact notice; the form column beside them). Below 840px the same markup is one column: remote, links, form, notice. The page passes the form in as children.
- `pages/contact/content/`: the profile URLs and message ids; `ContactPage` renders heading, `OfflineNote`, then the panel. `OfflineNote` moves into the form column in 4.5.
- `i18n/en/contact.json` (contact.remote, contact.notice, contact.profile.*.label), registered in `messages.ts`.
- Tests: component, stylesheet and content unit tests, updated page test; `e2e/features/contact.feature` (desktop columns, phone order, palette).
- Decisions: the heading keeps the shared Heading look (the Panel supplies the #5c8b70); Playfair Display is used for field labels in 4.3, the remote line and notice use the site font (Amethysta).
- `scripts/verify.sh` GREEN; E2E green.
