---
# portfolio-vhde
title: Tests in _specs_/, media in media/
status: completed
type: task
priority: normal
created_at: 2026-11-09T16:41:38Z
updated_at: 2026-11-09T16:42:36Z
---

## What to build

The Owner's layout rule: each chunk keeps its unit tests in a `_specs_/` subfolder and its media files (images, icons, fonts) in a `media/` subfolder. Apply it across `frontend/` and write it into the rules.

## Acceptance criteria

- [x] Every unit test under `frontend/src` and `frontend/tools` sits in its chunk's `_specs_/` folder; imports and on-disk paths are updated.
- [x] Every media file sits in its chunk's `media/` folder.
- [x] `.claude/rules/structure.md` (frontend layout), and the summary in `AGENTS.md`, state the rule; no doc still says tests sit next to the file.
- [x] `pnpm --dir frontend e2e` green
- [x] `scripts/verify.sh` GREEN

## Summary of Changes

- 11 unit tests moved into their chunk's `_specs_/` folder (10 in `src/`, 1 in `tools/`), with relative imports and on-disk paths one level deeper.
- `AnimatedLogo/dooooo.svg` moved to `AnimatedLogo/media/`.
- `structure.md` and `AGENTS.md` state the rule. Unit tests 74/74, E2E 4/4.
