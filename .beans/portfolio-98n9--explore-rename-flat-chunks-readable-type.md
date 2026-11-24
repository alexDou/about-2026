---
# portfolio-98n9
title: Explore rename, flat chunks, readable type
status: completed
type: task
priority: normal
created_at: 2026-11-15T08:36:55Z
updated_at: 2026-11-15T10:43:20Z
---

Follow-up to the Owner's About and font edits (2026-11-15): review fixes, the Board renamed to Explore everywhere, a flatter chunk layout, and readable type on phones.

## Decisions

- The domain term Board becomes Explore everywhere (code, CSS classes, message ids, CONTEXT.md, specs, rules, E2E). The route is already `/explore`. ADRs and closed beans are records and stay as written.
- Pages stay in `pages/`: Explore gets `pages/explore/ExplorePage.tsrx`; the domain component lives in `components/domain/explore/`.
- Sub-components sit directly under their parent chunk, no `components/` folder inside a component (`explore/panel/sublabel/`). Rule in `.claude/rules/structure.md`, applied project-wide.
- `useEscapeKey` is domain-agnostic: global `hooks/use-escape-key/`.
- Fonts: Amethysta (body text) self-hosted in `styles/fonts/`, Latin subset, covered by `OFL.txt`; serif fallback only. No Google Fonts links.
- Line heights: headings 1.28, credo 1.32, content 1.4.
- Content font size grows with the window through `progress()` (fixed fallback first); text on phones stays comfortable to read: content 17px on a small phone, small text at least 15px.
- The close button stays above the page on phones and desktops.

## Checklist

- [x] Explore entrance animation back on `<main>`; a unit test that every class of the Explore stylesheet is used, and an E2E step that `<main>` itself slides in when the logo opens Explore
- [x] `tokens.test.ts`: `--font-heading`, `--font-panel`, `--font-site`, line-height tokens
- [x] Credo: no fallback size needed (inherited size is the fallback); tests follow
- [x] Hobby names `<h3>`, font size adjusted, no `display: block`
- [x] Stale tests fixed (body font, languages/hobbies columns, test names)
- [x] Science Hobby without "These days mostly" (`about.json`)
- [x] Amethysta self-hosted, `@font-face` with the Latin `unicode-range`, OFL entry
- [x] Line heights per the decision
- [x] Content font size with `progress()`; small text at least 15px on phones
- [x] Close button stays on top of the page content
- [x] `useEscapeKey` moved to `hooks/use-escape-key/`
- [x] Sub-components flattened (Explore, About roles card); `structure.md` updated
- [x] Board → Explore rename across code, messages, docs, E2E; `pages/explore/` created
- [x] `scripts/verify.sh` GREEN; `pnpm --dir frontend e2e` green

## Summary of Changes

- Review fixes: the entrance class back on `<main>` (`.explore`), guarded by `explore/_specs_/styles.test.ts` (every class of the stylesheet is rendered; the `.explore` rule slides in and clips) and `Explore.test.ts`; E2E step "Explore itself slides in" reads `<main>`'s own animations by their keyframes (the build hashes keyframe names; `overflow` comes back as `overflowX`/`overflowY`). Token test names restored, credo without its own size, hobby names `<h3>` at `1em`, stale tests updated (body font, column ratio, heading token wording, AboutPage h3 list).
- Fonts: Amethysta self-hosted (`styles/fonts/Amethysta-Regular-latin.woff2`, Latin `unicode-range`), OFL entry from the font's name table (Cyreal 2011); `--font-site: "Amethysta", serif`; a test fails on any Google Fonts link in `index.html`. E2E: site font Amethysta, Panel titles still load Overused Grotesk.
- Type: body text `1.0625rem` → `calc(1.0625rem + 0.0625rem * progress(100vw, 22.5rem, 80rem))` (17px → 18px) in `global.css`; card texts sized in `em` from it (titles 1.1em, technologies, CV link, status badge, offline note 0.9em, so at least 15px on phones). Line heights: content 1.4, credo 1.32, headings unchanged.
- Close button: the sticky bar has `z-index: 1` above the page, `pointer-events` only on the button, which takes the slot's tone (`--tone-bg`) so it reads over text, on phones and desktops.
- Rename Board → Explore everywhere: component, folder, CSS classes, hooks (`useExploreFocus`, `useExploreSync`), route state (`ExploreState`, `EXPLORE_KIND`, `DEFAULT_EXPLORE`, `expandedExplore`, `EXPLORE_PATH`), `explore.*` message ids (`i18n/en/explore.json`), `--enter-explore`, E2E (`explore-look.feature`), `CONTEXT.md` (Board kept as an _Avoid_ term), `units.md`, rules. ADRs and closed beans untouched.
- `pages/explore/ExplorePage.tsrx` is the route component; it renders the domain `Explore` (no stylesheet of its own).
- Flat chunks: `explore/{panel,panel/sublabel,slot,stripe,expanded-panel}`, `about-top-card/{portrait,profile-links}`, `about-roles-card/role-entry`; `structure.md` says sub-components sit directly in the parent folder. `useEscapeKey` in `hooks/use-escape-key/`; the hooks rule says a domain-agnostic hook is global from its first consumer.
- Science Hobby: "Physics and research on health and ecology."
- `scripts/verify.sh` GREEN; `pnpm --dir frontend e2e` 78/78.


## Close button, second pass (2026-11-15)

- The Owner rejected the overlay (a sticky bar painted over the page). Now the button never covers the page: on desktop it has a sticky column of its own beside the page (an empty column on the left keeps the page centred); on phones it is a row above the page and scrolls away with it. The page sits in `.expanded-panel__page`.
- Tests: `expanded-panel/_specs_/styles.test.ts` (no `z-index`, `pointer-events` or absolute/fixed; desktop column, phone row); E2E "the close button sits beside the page, not over it" (desktop) and the phone scenario (above the page, scrolled out of view). E2E 79/79.


## Close button and About head, third pass (2026-11-15)

- The Owner: no extra room for the close button (no column, no row of its own). The close bar is back to its pre-refactor shape, in the flow and not sticky; it scrolls away with the page.
- About page: right padding 0 on desktop, 2rem on phones; a grid, so the badge row's hang and the top card's margin add up instead of collapsing.
- Badge row: reaches up beside the close button on every screen. Wide (>1056px): six badges in one line, no `max-width`, `flex: 1 1 0`; the row hangs half a badge into the top card through a percentage margin, `(room + 5 gaps - 100%) / 12` (badges are square). Up to 1056px: rows of three above the card, as on phones; phones keep 1.5rem room for the button (the 2rem page padding takes the rest).
- Top card: `margin-top: -0.25rem`, so its 0.5rem top border's middle sits on the badges' middle; top padding 4.8rem clears the hanging half (3.4rem to 4rem). One-column layout up to 1056px.
- E2E: About head at 1280 (one line, button level and clear, border through the middle), 1000 and 375 (rows of three above the card); the close button scrolls out of view. 81/81.


## Close corner (2026-11-15)

- The Owner's idea, after a page-curl reference: the close button is `CornerButton` (`components/ui/corner-button/`, reusable: `label`, `onClick`), a 1.4rem (22.4px) square whose upper-right flap is drawn by one `radial-gradient` around the lower-left corner (lighter at the fold, darker toward the corner), lower-left transparent. Colour `--color-accent: #e4572e`.
- The Expanded panel puts it sticky in its top-right corner on every screen, sharing the page's grid cell (no room of its own), `z-index: 1` over the positioned About badge row, first in the tab order.
- Pages keep their top room themselves now (4rem on the stub pages, 1rem on About); the About badge row lost its pull-up and its close-button room; the top card's top padding is 5.1rem for the wider badges.
- Owner's edits reviewed: `--element-distance-standard: 1.8rem` replaces 1.5rem; the doubled gap between badges and top card up to 1056px fixed (badge row margin back to 0). Open: the mobile Stripe basis (`1lh + 1.8rem`) no longer matches the Stripe's own 1.5rem padding; E2E "Mobile Stripes ... title plus 1.5rem" fails until that is decided.


## Close corner: WCAG (2026-11-15)

- 24px (`1.5rem`), the WCAG 2.5.8 minimum target; an E2E step checks the rendered size.
- Contrast (1.4.11): measured, no single red reaches 3:1 on every panel (#e4572e: About 3.42, What I do 2.62, Skills 1.51, Chat 1.13, Contact 1.06; the luminance window for About and What I do alone is empty). The arc carries a 0.125rem crease in `currentColor`, the panel text colour (3.03 to 8.97 on the five panels); the focus ring uses it too. The red stays the fill, lightened only 15% at the fold.
