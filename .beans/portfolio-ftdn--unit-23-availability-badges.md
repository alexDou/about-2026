---
# portfolio-ftdn
title: 'Unit 2.3: Availability badges'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-12T16:19:41Z
updated_at: 2026-11-14T10:17:13Z
parent: portfolio-18oz
blocked_by:
    - portfolio-3wkt
---

## Parent

portfolio-18oz (Unit 2: About). Design: the Unit 2 section of `docs_src/specs/units.md` (fully decided in the 2026-11-12 grilling, rounds noted in the epic). Vocabulary: `CONTEXT.md` (Headline, Bio, Role, Hobby, CV). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

The six availability badges, each our own inline SVG drawn after the shape and colours of its reference in `support_files/about/*_badge.*` (watermarked stock: reference only, nothing copied), and the badge row.

## Acceptance criteria

- [x] Tests written first and red, then green (TDD)
- [x] Available Now: starburst, green (only), "AVAILABLE" / "NOW"
- [x] Full-time: round stamp with a ribbon, "FULL-TIME"
- [x] Contract: scalloped gold seal with a star, "CONTRACT" on the ring
- [x] Relocation: the cart with wheels, "RELOCATION"
- [x] Remote work: zig-zag blue seal, "REMOTE WORK" on the top arc, "READY" on the bottom
- [x] AI ready: hexagon, "AI READY"
- [x] Reference colours kept, slightly muted to sit with the palette
- [x] Text is real SVG text from the messages (on a path where the reference curves it), each badge with its expressive `title` from the messages and an accessible name
- [x] Sized in rem, big and readable; a wrapping flex row at the top left of the page, level with the Expanded panel's close button; on desktop all six on one row with a good margin to the button; two rows of three on phones; the row scrolls with the page (its overlap of the top card's top border moved to portfolio-fbzp, where the card exists)
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-3wkt

## Summary of Changes

Six inline-SVG badges and the badge row, in `pages/AboutPage/components/AvailabilityBadges/`:

- `BadgeFrame`: the shared SVG (`role="img"`, `aria-label` = the badge text, `<title>` = the expressive line, square 120 box). One sub-component per badge (AvailableNow, FullTime, Contract, Relocation, RemoteWork, AiReady), drawn after the references, colours muted, text as real SVG text (on arcs for Contract and Remote work; Remote work splits on " / " into top and bottom arc).
- `utils.ts`: pure path geometry (polygon, star, scallop, arc), unit-tested. SVG font sizes are `fontSize` attributes in the 120 box, so no stylesheet has a px length.
- Row: wrapping flex list, sized in rem; one desktop row (items shrink, checked at 860 and 1400 px in a browser), two rows of three under 840px. On desktop it is pulled up level with the close button and positioned above the sticky close bar so hover titles work; on phones it sits under the button.
- `AboutPage` renders the row; its heading test no longer asserts the container text is only "About".
- Moved to portfolio-fbzp: the row overlapping the top card border (the card does not exist yet).

Review findings fixed: bar covering badge tops, wrap band, empty CSS rules. Left: the six-way `@switch` on string kinds, phone text size (about 8px for the longest words at 320px), E2E checks of the layout (2.N).
