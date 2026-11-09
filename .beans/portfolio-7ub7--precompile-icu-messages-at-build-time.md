---
# portfolio-7ub7
title: Precompile ICU messages at build time
status: scrapped
type: task
priority: normal
created_at: 2026-11-09T15:32:00Z
updated_at: 2026-11-09T16:19:24Z
parent: portfolio-m9gt
---

## Parent

portfolio-m9gt (Unit 1: Board). Text and messages: ADR 0003. Follows portfolio-u8a6, whose findings put FormatJS at about 68 KB minified (20 KB gzipped) in `main.js`; about 29 KB (8 KB gzipped) of that is the ICU parser.

## What to build

The build compiles every ICU message file to FormatJS ASTs, so the bundle can ship without the ICU parser (FormatJS's documented `no-parser` alias). The site formats every text as before. Tests and the type check keep reading the source message strings.

## Acceptance criteria

- [x] Tests first and red, then green (TDD, per the rules)
- [x] An Rspack loader compiles each message file under `src/i18n/` to ASTs at build time (dev and production). No compiled file is generated into the repo.
- [x] `@formatjs/icu-messageformat-parser` resolves to its `no-parser.js` build in the bundle, and `main.js` shrinks (record the sizes).
- [x] The compiled messages format exactly like the source strings, checked for every English message.
- [x] The built site shows every Landing text as before: `pnpm --dir frontend e2e` green.
- [x] The trap is written down: in the build, a message string that FormatJS must parse at run time cannot be formatted. (It does not throw: FormatJS logs the error and renders the string verbatim.)
- [x] `scripts/verify.sh` GREEN

## Decisions

- An Rspack loader (`tools/messages-loader.ts`) instead of the `formatjs compile` CLI writing files. The loader runs on every build, dev included, with the installed parser, so the AST always matches the runtime and no generated file lives in the repo. Its output is the same as `formatjs compile --ast`: `parse(message)` per id. A malformed message fails the build and names its id.
- The `no-parser` alias (`@formatjs/icu-messageformat-parser$` → `no-parser.js`) is FormatJS's documented way to drop the parser. It applies in dev and production, and vitest keeps the real parser, so tests and the type check read the source strings.
- Silent-failure trap, found while getting red. With no parser, FormatJS cannot format a string message, and it falls back to rendering the raw string. In production its default `onError` logs nothing, so the alias without the loader still passed E2E. Two guards now: `IntlProvider` reports formatting errors in every build (`onError` → `console.error`), and the Landing E2E scenario checks "the page logs no errors" (console errors and uncaught exceptions). With those, the alias without the loader went red ("You're trying to format an uncompiled message…"), and the loader made it green.

## Summary of Changes

- `frontend/tools/messages-loader.ts` (+ tests: every value becomes an AST, compiled English messages format exactly like their source strings, plurals and arguments survive, and a malformed message fails with its id).
- `frontend/rspack.config.ts`: a loader rule for `src/i18n/**/*.json` and the `no-parser` alias.
- `IntlProvider`: `onError` reports to the console in every build.
- E2E: the world collects console errors and page errors, and the Landing scenario checks "the page logs no errors".
- Bundle: `main.js` went from 258,838 B to 229,967 B (−28.9 KB), and gzipped from 83,926 B to 75,619 B (−8.3 KB). The source map lists `no-parser.js`, and the messages ship as ASTs. A development build also compiles the messages.
- Docs: `frontend.md` notes the precompiled messages and the verbatim-fallback trap, and says app-wide code (`useRoute`, navigation) is global. `structure.md` and `AGENTS.md` now say "domain-agnostic or app-wide".

## Reasons for Scrapping

The Owner dropped the build-time compile step, preferring the i18n library's own setup: messages stay in FormatJS's flat JSON and FormatJS parses them at run time. About 29 KB is not worth a custom build step. The work was reverted, including its guards: `IntlProvider`'s always-on `onError` and the E2E "page logs no errors" step, both added only for the no-parser trap. `frontend.md` records the decision.
