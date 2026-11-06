---
# portfolio-6y6f
title: Convert frontend components to TSRX
status: completed
type: task
priority: normal
created_at: 2026-11-06T16:00:36Z
updated_at: 2026-11-06T16:00:36Z
---

Move Octane components from .tsx to .tsrx to get @if/@for/@switch blocks and Strong mode, keeping tsrs and Oxc tools.

## Summary of Changes

- 5 components converted to `.tsrx` (AnimatedLogo `.map()` loops became `@for`); `main.tsx` became `main.ts`, tests became `.test.ts`.
- tsrs type-checks `.tsrx` via `--runExternalCode` and `@tsrx/content-mapper`; `tools/octane-tsrx-mapper` shims the `compileToVolarMappings` naming mismatch.
- oxlint/oxfmt now come from `@tsrx/oxc` (standalone packages removed, they skipped `.tsrx`).
- Includes the pending Dooooo wordmark inside the logo (`dooooo.svg`, SVG asset rule, `WORDMARK_BOX`).
- Known: landing e2e scenario expects a "Portfolio" heading that was never rendered (pre-existing).
