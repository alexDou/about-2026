---
# portfolio-dbxq
title: 'Unit 1.1: Site shell'
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-09T10:30:50Z
parent: portfolio-m9gt
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

The site-wide basics the Board needs, visible on the Landing today. Overused Grotesk, self-hosted, is the site font. The Panel palette and the two text colours are global tokens. Search engines are told not to index the site, AI-training crawlers are kept out, and the stale `logo/` mentions in `AnimatedLogo` are fixed.

## Acceptance criteria

- [ ] Unit and integration tests written first and red, then green (TDD, per the rules) where the behaviour is testable (the robots meta in the built HTML, the `robots.txt` rules)
- [ ] Overused Grotesk (the variable woff2 kept in `support_files/fonts/`) is in the repo, loaded with `font-display: swap` and used site-wide; its license travels with it if the license asks for that.
- [ ] Global tokens for the palette (About `#25363a`, What I do `#d1dcd9`, Skills `#67b3a8`, Chat with me `#4c839f`, Contact `#5c8b70`) and the text colours (`#d1dcd9` on dark, `#25363a` on light). The Landing's own colours are unchanged.
- [ ] Every page carries `<meta name="robots" content="noindex, nofollow">`.
- [ ] `robots.txt` at the site root lets ordinary crawlers in (so they read the noindex) and disallows AI-training crawlers (GPTBot, ClaudeBot, CCBot, Google-Extended and similar).
- [ ] `AnimatedLogo` comments point at `support_files/logo/` instead of `logo/`.
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- None (can start immediately)
