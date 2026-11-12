---
# portfolio-viuq
title: 'Unit 2.2: About assets'
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

The media and fonts the About page needs, colocated in the About page chunk (`pages/AboutPage/media/`, `pages/AboutPage/fonts/`), each with its licence where it has one.

## Acceptance criteria

- [ ] Photo: from `support_files/about/me.png` (the Owner's cut-out, 1079×1457, transparent), served as AVIF and WebP at about 400 and 800px wide, transparency kept
- [ ] Playfair Display, regular, Latin subset, self-hosted woff2, with its OFL licence; used only by About's greeting and section headings
- [ ] Brush-stroke SVG (CC0 or OFL source, licence beside it) for behind the photo, recolourable to `#25363a` at about 10%
- [ ] Node burst SVG, greyed out for the dimmed card background, from the approved draft (`support_files/about/nodes-draft/`, `nodes.py` seeded generator); the 60×60 version is the logo bean's, not this one
- [ ] No file over what its display size needs; sizes noted in the Summary
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-3wkt
