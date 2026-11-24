---
# portfolio-lo13
title: 'Unit 5.6: Takeover cards that flip on hover'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-24T13:52:15Z
updated_at: 2026-11-24T13:52:15Z
parent: portfolio-349l
blocked_by:
    - portfolio-ytti
    - portfolio-hv6d
---

## Parent

portfolio-349l (Unit 5: What I do). Design: the Unit 5 section of `docs_src/specs/units.md` ("Decided"). Vocabulary: `CONTEXT.md` (Takeover, Takeover group, Benefits). Text: FormatJS messages (ADR 0003), content as static frontend JSON (ADR 0001).

## What to build

Every Takeover as a flip card, in random order when the page opens. Front: the group's name in the top-right corner, the title in the centre, on the group's own colour. Back: the text centred vertically and aligned left, Benefits where there are any, on a lighter shade of the group's colour with dark text at 4.5:1 or better. On desktop, hovering a card shows its back and leaving shows the front. Under reduced motion a card fades instead of turning. Card size, title size, colours and how a long back fits (or grows over the row below) follow the prototype's verdict in portfolio-hv6d.

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] Every Takeover in the content shows as one card; the order is random per page open
- [ ] Front and back show the parts above; Benefits only where the Takeover has them
- [ ] Hover flips on pointers that hover; reduced motion fades
- [ ] The six group colours and their back shades as settled in the prototype, contrast checked
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-ytti (Unit 5.2: Takeover content contract)
- portfolio-hv6d (Unit 5.0: Takeover card prototype)
