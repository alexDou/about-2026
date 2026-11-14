---
# portfolio-rhr5
title: 'Restructure frontend chunks: kebab-case folders, About badges to domain'
status: completed
type: task
priority: normal
created_at: 2026-11-14T11:26:48Z
updated_at: 2026-11-14T11:30:58Z
---

## What to build

Restructure the frontend chunks after the Owner's naming convention (decided 2026-11-14), and move About's badge components out of the page chunk.

## Convention

- Chunk folders (pages, `components/ui`, `components/domain`, sub-components, hooks) are kebab-case: `board`, `api-status`, `pages/chat-with-me`, `ui/badge-frame`, `hooks/use-api-health`.
- The component file keeps its PascalCase name (`ApiStatus.tsrx`, `BadgeFrame.tsrx`); hook files keep theirs (`useApiHealth.ts`). Exception: `i18n/`, whose files are kebab-case (`intl-provider.tsrx`, `intl-context.ts`).
- A page folder holds the page only. Its components live in `components/` (ui or domain), and what the page owns (`content/`, `media/`) is passed to them as props.
- A domain chunk never imports from a page. Types are not shared down from a page and not up from a domain: each side declares its own, matching structurally.

## Acceptance criteria

- [x] Owner's uncommitted rename (kebab-case folders, `i18n/` files) committed with this bean
- [x] Remaining chunks converted: `ui/{AnimatedLogo,Heading,StatusBadge}`, the Board's sub-components, hook folders
- [x] `BadgeFrame` in `components/ui/badge-frame/`
- [x] The six badges in `components/domain/about/badges/`, with their shared geometry and constants
- [x] `AvailabilityBadges` renamed `AboutStatusBadges`, in `components/domain/about/about-status-badges/`; it declares its own badge kinds and props types
- [x] `pages/about` keeps only the page, `content/` and `media/`; the page passes the badges in as a prop
- [x] Playfair Display moved to `styles/fonts/`, sharing `OFL.txt` with Overused Grotesk (`@font-face` stays for portfolio-fbzp)
- [x] Convention written into `.claude/rules/structure.md` (and `frontend.md` where it touches class names), `AGENTS.md` examples updated
- [x] `scripts/verify.sh` GREEN

## Summary of Changes

- Owner's rename committed with this bean: kebab-case chunk folders, `i18n/` files (`intl-provider.tsrx`, `intl-context.ts`, `en/messages.ts`, `_specs_/testing.ts`); `what-I-do` became `what-i-do`.
- Converted by a script that rewrote every relative import: `ui/*`, the Board's sub-components, all hook folders (`use-route`, `use-intl`, ...). Hook and component files keep their code names.
- About: `BadgeFrame` to `ui/badge-frame` (own props, owns the 120 view box); the six badges plus `utils.ts`/`config.ts`/`types.ts` to `domain/about/badges/` (folders `ai-ready-badge` etc., so the BEM block still equals the folder); `AvailabilityBadges` to `domain/about/about-status-badges/` as `AboutStatusBadges`, with its own `STATUS_BADGE_KINDS`, `AboutStatusBadge` type, and a test fixture instead of page content. `pages/about` holds the page, `content/`, `media/` and passes `ABOUT_CONTENT.badges` in. No component imports a page.
- Playfair Display moved to `styles/fonts/`; one `OFL.txt` with both copyright lines; the served licence is now `/licenses/fonts-OFL.txt` (rspack copy, E2E feature). The font and licence tests moved to `styles/_specs_/tokens.test.ts`.
- Rules: new "Naming" section in `structure.md`, paths updated in `frontend.md` and `AGENTS.md`; page class block keeps `Page` (`about-page`) while its folder drops it.
- Gate: verify GREEN, E2E 77 scenarios passed.
