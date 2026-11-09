---
# portfolio-dal6
title: Messages stored as FormatJS AST, no runtime parser
status: completed
type: task
priority: normal
created_at: 2026-11-09T16:28:40Z
updated_at: 2026-11-09T16:30:43Z
parent: portfolio-m9gt
---

## Parent

portfolio-m9gt (Unit 1: Board). ADR 0003. Replaces the scrapped portfolio-7ub7: no build step.

## What to build

The message files in `src/i18n/` hold FormatJS's compiled AST JSON (the output of `formatjs compile --format simple --ast`) instead of ICU strings, and the bundle ships without the ICU parser (`no-parser` alias). The site shows the same texts.

## Acceptance criteria

- [x] Tests first and red, then green (TDD, per the rules)
- [x] Every message file under `src/i18n/` is AST JSON. `MessageId` is still derived from it, and the message values are typed as ASTs.
- [x] `@formatjs/icu-messageformat-parser` resolves to `no-parser.js` in the bundle, and `main.js` shrinks (record the sizes).
- [x] The message tests check every message formats without error and keep the required texts.
- [x] `frontend.md` says how to add or edit a message.
- [x] `pnpm --dir frontend e2e` green
- [x] `scripts/verify.sh` GREEN

## Summary of Changes

- `src/i18n/en/*.json` converted in place with `pnpm dlx @formatjs/cli compile <file> --format simple --ast`.
- `messages.ts` types the values as `MessageFormatElement[]`. One cast is needed because JSON types the AST `type` field as a plain number. `MessageId` is still derived from the keys. `Messages` is AST-typed, so a string message is a type error.
- `@formatjs/icu-messageformat-parser` 3.5.22 moved to dependencies, for the AST type. `rspack.config.ts` aliases it to `no-parser.js`.
- Tests: `messages.test.ts` checks that every message is an AST that formats without error (with a self-test) and checks the required texts by formatting them. `intlWrapper` overrides take ICU strings and parse them in tests. The `index.html` title guard formats `site.title`.
- Bundle: `main.js` went from 255,787 B to 229,933 B, and is 75,601 B gzipped. Only `no-parser.js` is bundled. E2E 4/4.
- `frontend.md` explains how to add or edit a message.
