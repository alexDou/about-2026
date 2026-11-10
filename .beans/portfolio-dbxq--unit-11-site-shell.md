---
# portfolio-dbxq
title: 'Unit 1.1: Site shell'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-10T05:27:49Z
parent: portfolio-m9gt
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

The site-wide basics the Board needs, visible on the Landing today. Overused Grotesk, self-hosted, is the site font. The Panel palette and the two text colours are global tokens. Search engines are told not to index the site, AI-training crawlers are kept out, and the stale `logo/` mentions in `AnimatedLogo` are fixed.

## Acceptance criteria

- [x] Unit and integration tests written first and red, then green (TDD, per the rules) where the behaviour is testable (the robots meta in the built HTML, the `robots.txt` rules)
- [x] Overused Grotesk (the variable woff2 kept in `support_files/fonts/`) is in the repo, loaded with `font-display: swap` and used site-wide; its license travels with it if the license asks for that.
- [x] Global tokens for the palette (About `#25363a`, What I do `#d1dcd9`, Skills `#67b3a8`, Chat with me `#4c839f`, Contact `#5c8b70`) and the text colours (`#d1dcd9` on dark, `#25363a` on light). The Landing's own colours are unchanged.
- [x] Every page carries `<meta name="robots" content="noindex, nofollow">`.
- [x] `robots.txt` at the site root lets ordinary crawlers in (so they read the noindex) and disallows AI-training crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended and similar).
- [x] `AnimatedLogo` comments point at `support_files/logo/` instead of `logo/`.
- [x] `scripts/verify.sh` GREEN

## Blocked by

- None (can start immediately)

## Summary of Changes

- Overused Grotesk variable woff2 and its SIL OFL 1.1 text in `frontend/src/styles/media/`, declared in `fonts.css` (`font-display: swap`, weight 200 900) and set on the body through `--font-site`. The build copies the license to `/licenses/OverusedGrotesk-OFL.txt` so it travels with the served font.
- `tokens.css` holds all global tokens: the existing Landing colours (unchanged), the five Panel palette colours, `--text-on-dark` and `--text-on-light` (aliases of the palette values).
- `<meta name="robots" content="noindex, nofollow">` in `index.html`; `public/robots.txt` (copied to the site root by `CopyRspackPlugin`) lets `*` in and disallows AI-training crawlers.
- `AnimatedLogo` comments point at `support_files/logo/`.
- Tests: `src/app/_specs_/site-shell.test.ts` (meta, robots.txt), `src/styles/_specs_/tokens.test.ts` (tokens, font, license); E2E `site-shell.feature` against the build (meta, robots.txt, font loaded, license served).
- `public/` documented in `.claude/rules/structure.md`.

## Decisions

- The unit tests read the source `index.html`; the E2E feature checks the built HTML.
- Crawler list limited to training crawlers; search/user-triggered bots (OAI-SearchBot, ChatGPT-User, PerplexityBot) are not blocked.
