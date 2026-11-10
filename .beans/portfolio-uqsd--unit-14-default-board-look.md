---
# portfolio-uqsd
title: 'Unit 1.4: Default Board look'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-10T10:58:08Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-dbxq
    - portfolio-3n34
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

`/explore` looks like the pen's expanded menu in our palette. Five Panels in their tones, each with its palette text colour and the pen's title style, titles centred on both axes, and Sublabels on What I do and Chat with me. Desktop shows equal-width full-height columns; mobile shows equal-height full-width rows that never collapse to slivers.

## Acceptance criteria

- [x] Unit and integration tests written first and red, then green (TDD, per the rules)
- [x] Panel and Sublabel components inside the Board chunk. The tone is a prop, switched as a class with `classnames`; each Panel's tone is its position.
- [x] Text colours from the palette: `#d1dcd9` on About, `#25363a` on the other four.
- [x] Titles in the pen's style (uppercase, wide letter-spacing), 1rem (the pen: 0.9rem), Overused Grotesk, centred on both axes by layout. In the default state only the title is clickable.
- [x] A Sublabel renders only for Panels whose Sublabel message exists (What I do, Chat with me).
- [x] Desktop: columns share the width evenly at full screen height; the Board is at least 32rem tall.
- [x] Mobile (≤ 640px wide): rows share the height evenly; the Board is at least 420px tall; rows stay readable at ≤ 550px wide (the pen's flaw).
- [x] Checked in the browser at about 1280×800, 375×667 and 360px wide.
- [x] Round 2 (user feedback): the title is 1rem, not 1.5rem. The spec, `docs_src/specs/units.md`, says 1rem too.
- [x] Round 2: no line crosses the title. On hover and focus a row of moving dots (like `support_files/moving-dots`, CSS only) slides in above the title, the full Panel width and just tall enough for the dots, as far above the title as the Sublabel is below it (one shared gap).
- [x] Round 2: the Board's gentle unfold from the pen plays when the Visitor goes Landing → Board with the logo click (Board slides in 300ms, Panels follow 150ms apart, titles fade in 140ms), and not on a direct visit, a reload or Back/Forward. Reduced motion: instant.
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-dbxq (Unit 1.1: Site shell)
- portfolio-3n34 (Unit 1.3: Landing ↔ Board routing)

## Summary of Changes

- `Board` renders five `Panel`s (`components/Panel/`), each with its tone from `TONE_BY_PANEL` (ink, mist, teal, blue, green, the palette in Board order); `Sublabel` lives under `Panel` (its only user). Tone is a prop switched as a class with `classnames` (added, pinned 2.5.1); colours come from the global tokens through `--tone-bg`/`--tone-fg`.
- Titles: pen style (uppercase, 0.2em letter-spacing, the line that slides in on hover and `:focus-visible`), 1.5rem, Overused Grotesk, centred by grid. Sublabel is a `<p>` outside the link, shown where `SUBLABEL_BY_PANEL` has a message (What I do, Chat with me); a test keeps that map equal to the Sublabel messages.
- Layout: desktop equal-width full-height columns (Board min 32rem), mobile (<= 640px) equal-height rows (Board min 420px, 84px per row at least).
- Review findings fixed: "CONTACT" clipped at 641-700px (tighter letter-spacing there), the Sublabel overflowed narrow columns and the shortest rows (capped to the Panel width via `cqw`, less title padding), removed a test-only `data-tone`.
- E2E `board-look.feature` (28 scenarios in total): computed colours, title style, Sublabels, layouts at 1280x800, 375x667, 360x640, 320x568, short windows, 641px, hover/focus line. Screenshots checked at 1280x800, 375 and 360 wide.

## Summary of Changes (round 2, user feedback)

- Titles are 1rem (was 1.5rem; the pen: 0.9rem). The narrow-desktop letter-spacing workaround is gone, it is not needed at 1rem. `units.md` and this bean say 1rem.
- The line that crossed the title is replaced by a row of moving dots (CSS only, a tiled radial gradient drifting sideways, after `support_files/moving-dots`): the Panel's full width, 4px tall, above the title. Its distance to the title and the Sublabel's distance below it are one token, `--label-gap`. It slides in on hover and `:focus-visible`; with reduced motion it stays still.
- The pen's unfold plays on the Landing → Board logo click only: the Board slides in (300ms), the Panels unfold 150ms apart (perspective, rotateY -180deg to 0, 950ms), then the titles and Sublabels fade in (140ms). The Board reads `userTriggered` once at mount, so a direct visit, a reload and Back/Forward do not play it. Reduced motion: instant. Timings are `--enter-*` tokens in `tokens.css` (checked by `tokens.test.ts`).
- Trap found: Lightning CSS hashes custom property names per CSS module, so a property defined in one `.module.css` is invisible in another. Shared ones live in `tokens.css`. It also lowers `translate` into `transform`, which a later `transform` overrides: the dots row is centred with margins instead.
- Tests: App (entrance by route), Panel (`entering`), tokens, and E2E (1rem titles, dots position, size, gap, movement, no-line-across, entrance on logo click, none on direct visit or Forward, reduced motion): 33 scenarios.

## Summary of Changes (round 3, user feedback)

- The small jump at the end of the unfold: the Panels swing in 3D with perspective, which projects them past the window (863px tall in an 800px window). Transforms count as scrollable overflow, so the page grew a vertical scrollbar for the unfold and lost it when the animation ended: the Board shrank 15px, then jumped back (the title moved 1.5px, the columns 15px). The pen does not have it because its overlay is `position: fixed`. Fix: the Board clips overflow for exactly the length of the entrance (`clip-overflow` animation over `--enter-total`), so later states stay unclipped. Found by sampling `scrollHeight`, `clientWidth` and the title position each frame; E2E now checks the page never grows during the unfold (desktop and phone).
- Kept the Owner's hand-tuned CSS: dots row 96% wide (2% inset each side), `--label-gap` 1.2rem. Tests follow. At 1.2rem the Sublabel no longer fit the 84px rows of the shortest phone windows, so below 460px tall the gap is 0.5rem again.
- The tokens test reads only the first `:root` block (the defaults).
- The wordmark removal is its own bean, portfolio-c1qs.

## Summary of Changes (round 4, user feedback)

- On a phone (<= 640px) the moving dots are no longer a full-width row above the title: as in the pen they are a short row (four dots) left of the title, centred on its height, 1rem before it, sliding in from the left on hover and focus. Desktop is unchanged.
- Kept the Owner's split of the gap into `--label-gap-top` (1.2rem, the dots) and `--label-gap-bottom` (0.6rem, the Sublabel); the "one shared gap" wording in this bean and in `units.md` is superseded. Tests resolve the tokens instead of comparing the two distances.
