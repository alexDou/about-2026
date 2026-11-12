---
# portfolio-ftdn
title: 'Unit 2.3: Availability badges'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-12T16:19:41Z
updated_at: 2026-11-12T16:19:41Z
parent: portfolio-18oz
blocked_by:
    - portfolio-3wkt
---

## Parent

portfolio-18oz (Unit 2: About). Design: the Unit 2 section of `docs_src/specs/units.md` (fully decided in the 2026-11-12 grilling, rounds noted in the epic). Vocabulary: `CONTEXT.md` (Headline, Bio, Role, Hobby, CV). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The six availability badges, each our own inline SVG drawn after the shape and colours of its reference in `support_files/about/*_badge.*` (watermarked stock: reference only, nothing copied), and the badge row.

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] Available Now: starburst, green (only), "AVAILABLE" / "NOW"
- [ ] Full-time: round stamp with a ribbon, "FULL-TIME"
- [ ] Contract: scalloped gold seal with a star, "CONTRACT" on the ring
- [ ] Relocation: the cart with wheels, "RELOCATION"
- [ ] Remote work: zig-zag blue seal, "REMOTE WORK" on the top arc, "READY" on the bottom
- [ ] AI ready: hexagon, "AI READY"
- [ ] Reference colours kept, slightly muted to sit with the palette
- [ ] Text is real SVG text from the messages (on a path where the reference curves it), each badge with its expressive `title` from the messages and an accessible name
- [ ] Sized in rem, big and readable; a wrapping flex row at the top left of the page, level with the Expanded panel's close button; on desktop all six on one row with a good margin to the button; two rows of three on phones; the row scrolls with the page and overlaps the top card's top border
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-3wkt
