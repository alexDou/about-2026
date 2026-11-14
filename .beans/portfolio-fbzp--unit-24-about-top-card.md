---
# portfolio-fbzp
title: 'Unit 2.4: About top card'
status: todo
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-12T16:19:41Z
updated_at: 2026-11-14T10:15:02Z
parent: portfolio-18oz
blocked_by:
    - portfolio-3wkt
    - portfolio-viuq
---

## Parent

portfolio-18oz (Unit 2: About). Design: the Unit 2 section of `docs_src/specs/units.md` (fully decided in the 2026-11-12 grilling, rounds noted in the epic). Vocabulary: `CONTEXT.md` (Headline, Bio, Role, Hobby, CV). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The top card, after `support_files/about/about-design.jpg` (no scroll arrow, no grey squares), dark-panel adapted.

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] Card on `--panel-what-i-do`, rounded border in a palette colour (picked when built, radius as in the reference)
- [ ] Left: the greeting "Hello, I'm Alexander Durnev. I'm a {Headline}." in Playfair Display (no location); the credo below, a bit bigger than the reference's line; LinkedIn and GitHub icons; the CV download button (wired in 2.6)
- [ ] Right, centred vertically: the photo over the brush stroke, both responsive, about the same share of the card as in the reference
- [ ] One node burst, greyed and dimmed, where the reference's second-lowest square sits (below the icons, left), a little bigger than that square
- [ ] Phone: badges, then the photo, then the rest; the node burst's phone look checked with the Owner
- [ ] All text from the About messages
- [ ] The badge row (built in portfolio-ftdn) overlaps the card's top border: the card pulls up under the row with a negative top margin; the row's items already paint above a later block's background
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-3wkt
- portfolio-viuq

