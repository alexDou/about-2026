---
# portfolio-hv6d
title: 'Unit 5: Takeover card prototype'
status: todo
type: task
priority: normal
created_at: 2026-11-24T12:54:51Z
updated_at: 2026-11-24T13:20:08Z
parent: portfolio-349l
---

A throwaway UI prototype (the `prototype` skill, UI branch) of the What I do page, to settle the card's look before the breakdown. Spec: docs_src/specs/units.md#unit-5-what-i-do ("Decided"). Content: the agreed list of Takeovers (kept locally, not in the repo). Group pictures: the raw files in support_files/what-i-do/categories/ as placeholders until the pictures bean delivers.

Questions it answers, each shown to the Owner as variants:
- Card size and title size; the group's name in the top-right corner.
- Six group colours (the agent's proposal) and the back's lighter shades, dark text at 4.5:1 or better.
- The picture's opacity: in the background, never competing with the text.
- The back: text centred vertically, aligned left, smaller font and padding. First try to fit every back, the longest at 533 characters, in the card's size with these alone. Only if that fails: the card grows when flipped, animated, over the row below.
- The flip as decided in the spec (hover, pin and crossed-out unpin icon, Enter and Escape, the focus moves, "See details" and taps on touch); check that a click can tell a mouse from a tap (the click event's pointer type) in Chromium, Firefox and Safari.
- Shuffle with View Transitions, and the Shuffle / Copy takeovers row.

- [ ] Prototype on a throwaway route, one command to run
- [ ] Owner's verdict on each question, recorded here and in the spec
- [ ] Prototype captured on a throwaway branch, pointer left here
