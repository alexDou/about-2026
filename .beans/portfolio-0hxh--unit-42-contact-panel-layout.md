---
# portfolio-0hxh
title: 'Unit 4.2: Contact Panel layout'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-19T13:42:25Z
updated_at: 2026-11-19T13:42:25Z
parent: portfolio-yxux
blocked_by:
    - portfolio-trgn
---

## Parent

portfolio-yxux Unit 4: Contact. Spec: portfolio-tn1x (Unit 4: Contact spec) and the Unit 4 section of docs_src/specs/units.md. Vocabulary: CONTEXT.md. ADR 0005.

## What to build

Opening /contact shows the Contact Panel's layout: the heading on the Panel's #5c8b70, then one #d1dcd9 band with two columns. The left column holds "Remote, worldwide" with a globe icon, the LinkedIn and Xing links (ring look) between two rules, and the Contact notice; the right column is reserved for the form. Below 840px one CSS grid reorders the same markup: the remote line and the links, then the form, then the Contact notice above the submit button.

## Acceptance criteria

- [ ] Heading on the Panel colour; the band in #d1dcd9 with #25363a text
- [ ] Left column: "Remote, worldwide", LinkedIn (https://www.linkedin.com/in/a-doo/) and Xing (https://www.xing.com/profile/Alexander_Doo) in that order, the Contact notice
- [ ] Contact notice text: "I use these details only to reply to your request. They reach me by email and are not stored on this site or passed on to anyone."
- [ ] All text in a Contact message file (en), ids prefixed by area
- [ ] Amethysta for content, Playfair Display for headings
- [ ] Desktop two columns; below 840px the grid order from the spec, same markup
- [ ] The page owns its content and passes it down; the layout lives in a Contact domain component
- [ ] Page and component tests: composition, palette, layout mode; E2E scenario opening /contact on desktop and mobile
- [ ] scripts/verify.sh GREEN

## Blocked by

- portfolio-trgn Unit 4.1: Shared profile links with Xing
