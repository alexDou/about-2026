---
# portfolio-werw
title: One hook for SVG-safe ids
status: todo
type: task
tags:
    - ready-for-agent
created_at: 2026-11-18T14:42:38Z
updated_at: 2026-11-18T14:42:38Z
parent: portfolio-vqi0
---

## Context

Raised by the code review of portfolio-r41n (2026-11-18). Five components make an SVG-safe id the same way: `useId().replace(/[^\w-]/g, "")`, so the id works inside `url(#…)` and `href="#…"`. Copies: `components/ui/animated-logo/AnimatedLogo.tsrx`, three badges under `components/domain/about/badges/`, `components/ui/walking-toggle/WalkingToggle.tsrx`.

## What to build

One domain-agnostic hook in the global `hooks/` (e.g. `hooks/use-svg-id/useSvgId.ts`), used by all five, with its own test (the id has only word characters and hyphens, and is unique per call site).

## Acceptance criteria

- [ ] Tests written first and red, then green (TDD)
- [ ] The five copies use the hook; no `useId().replace(` left in `src/`
- [ ] `scripts/verify.sh` GREEN

## Blocked by

- None (can start immediately)
