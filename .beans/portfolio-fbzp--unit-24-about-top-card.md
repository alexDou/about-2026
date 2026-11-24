---
# portfolio-fbzp
title: 'Unit 2.4: About top card'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-12T16:19:41Z
updated_at: 2026-11-14T15:12:13Z
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

- [x] Tests written first and red, then green (TDD)
- [x] Card on `--panel-what-i-do`, rounded border in a palette colour (`--panel-skills`, radius as in the reference)
- [x] Left: the greeting "Hello, I'm Alexander Durnev." with the Headline on its own line, in Playfair Display (no location); the credo below, a bit bigger than the reference's line; LinkedIn and GitHub icons; the CV download button (wired in 2.6)
- [x] Right, centred vertically on the greeting and credo: the photo over the brush stroke, both responsive, its lower edge frayed by the brush outline and faded (no hard corners)
- [x] ~~One node burst~~: tried under the links and behind them, dropped by the Owner (2026-11-14); `nodes.svg` removed from About
- [x] Phone: badges (smaller, growing a little with the width, via `progress()`), a gap, then the photo, then the rest
- [x] All text from the About messages
- [x] The badge row (built in portfolio-ftdn) overlaps the card's top border on wider screens: the card pulls up under the row with a negative top margin; on phones a gap instead
- [x] The "About" `h1` stays for screen readers and focus, visually hidden on this page only (`Heading` `visuallyHidden`)
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-3wkt
- portfolio-viuq

## Notes

- Content contract extended: `greeting` (`about.greeting.hello`, takes `{name}`; the Owner later dropped the "I'm a" sentence, so the Headline follows as its own line) and `profiles` (LinkedIn, GitHub; URLs from the 2026 CV in `content/config.ts`). The content test skips `url` fields as it does `kind`.
- `AboutTopCard` in `components/domain/about/about-top-card/`, sub-components `portrait` (photo `<picture>` AVIF/WebP, brush drawn through `<use href="brush.svg#brush">` so CSS colours it) and `profile-links` (own LinkedIn drawing, GitHub mark from Simple Icons CC0).
- Border colour picked: `--panel-skills`, 0.5rem, radius 1.75rem.
- CV button is a `<span>` until 2.6 makes it a link (oxlint refuses an `<a>` without href).
- Playfair Display `@font-face` added to `styles/fonts.css`; rspack emits avif/webp as assets.
- Owner review (2026-11-14): heading visually hidden; greeting and credo sized with `progress()` (fixed fallback first); photo smaller, centred on the text, masked by `portrait/media/photo-mask.svg` (the brush outline without its streaks, plus a solid top half) and a gradient; badges smaller on phones with a gap before the card; node burst dropped.
- E2E and `App.test`: the Stripes are counted as in-site links (`href^="/"`), since About now links off-site.

- Code review (standards + spec): icon paths and view box moved to `profile-links/config.ts` as one map (no `@switch`); the brush is a stretched grid item; the photo keeps `width: 100%` (a replaced element keeps its natural width under a stretch, comment says so); `--font-greeting` token; `PHOTO_SIZES` brought in line with the smaller photo; stale comments fixed. Kept by decision: the negative top margin (the bean asks for it).

## Summary of Changes

- `AboutTopCard` (`components/domain/about/about-top-card/`) with sub-components `portrait` (AVIF/WebP `<picture>` over the brush stroke drawn through `<use>`, lower edge masked by `media/photo-mask.svg` plus a gradient) and `profile-links` (LinkedIn and GitHub icon links).
- About content contract: `greeting` (two messages taking `{name}` and `{headline}`) and `profiles` (labels as messages, URLs in `content/config.ts`); four new messages in `i18n/en/about.json`.
- About page: visually hidden `h1` (new `Heading` `visuallyHidden` option), badge row, top card. Badges smaller on phones via `progress()`, a gap before the card there; the card pulls up under the row on wider screens.
- Playfair Display `@font-face` and `--font-greeting` token; Rspack emits avif/webp as assets, with module typings.
- Node burst dropped by the Owner: `pages/about/media/nodes.svg` and its tests removed. Spec (units.md, Unit 2) updated with the Owner's decisions.
- `App.test` and the E2E Stripes locator count in-site links only, as About now links off-site.
- verify GREEN; E2E 77/77.
