---
# portfolio-u8a6
title: 'Unit 1.2: FormatJS on the Landing'
status: completed
type: task
priority: normal
tags:
    - ready-for-agent
created_at: 2026-11-09T10:30:50Z
updated_at: 2026-11-09T14:36:11Z
parent: portfolio-m9gt
blocked_by:
    - portfolio-lz1t
---

## Parent

portfolio-m9gt (Unit 1: Board). Design: the Unit 1 section of `docs_src/specs/units.md`. Vocabulary: `CONTEXT.md`. Text and messages: ADR 0003.

## What to build

Site text comes from FormatJS messages through our own thin, react-intl-style binding: an `IntlProvider` around the app and a shared `useIntl()` hook. The Landing is the first consumer: the logo's accessible label, the status badge text and the document title "A.Durnev portfolio".

## Acceptance criteria

- [x] Unit and integration tests written first and red, then green (TDD, per the rules)
- [x] The provider and hook format a message by id, with and without values; tests cover both.
- [x] Formatting runs on `@formatjs/intl`; neither React nor react-intl is in the bundle.
- [x] `useIntl()` is a shared hook; the provider wraps the app.
- [x] The logo label, the status badge text and the document title come from messages; no hard-coded UI strings remain on the Landing.
- [x] Existing Landing E2E scenarios that check changed text are updated, and `pnpm --dir frontend e2e` stays green.
- [x] `scripts/verify.sh` GREEN

## Blocked by

- portfolio-lz1t (Unit 1.0: Board and message contracts)

## Seams under test

- `i18n` public index: `IntlProvider`, which wraps a subtree and makes the site messages formattable inside it (English by default; a `messages` override for tests).
- `hooks/useIntl` public index: `useIntl()` returns the FormatJS `IntlShape`; `formatMessage` by id with and without values; outside an `IntlProvider` it throws.
- `LandingPage` rendered inside `IntlProvider`: the logo's accessible name, the status badge text and the document title come from messages.
- `ApiStatus` inside `IntlProvider`: its badge text per health state.
- E2E (`frontend/e2e/`): the Landing scenarios that check text.

## Decisions

- Placement: `IntlProvider` (`.tsrx`), `IntlContext` and the FormatJS id registry are the i18n setup and live in `src/i18n/` as flat files, not a component folder (the provider renders no DOM of its own, so it has no stylesheet). `useIntl()` is the shared hook in `hooks/useIntl/`; its consumers are `LandingPage` and `ApiStatus`.
- `useIntl()` returns FormatJS's `IntlShape`, as in react-intl. Outside an `IntlProvider` it throws instead of falling back silently.
- `IntlProvider` takes only `children` plus an optional `messages` override, which tests use. English (`en`) is the only locale and is fixed inside the provider. `children` is optional, as in React's `PropsWithChildren`, so tests can pass children positionally.
- Message ids are typed through FormatJS's own registry (`declare global { namespace FormatjsIntl { interface Message { ids: MessageId } } }` in `i18n/types.ts`), so `formatMessage({ id })` rejects an unknown id across the program. `ApiStatus` maps each health state to a literal id (`LABEL_BY_HEALTH`, beside `TONE_BY_HEALTH`), so `formatjs extract` and grep can see the ids. A template id would type-check too.
- Document title: the Landing renders `<title>` from `site.title`, and Octane hoists it into `<head>`. The static `<title>Portfolio</title>` is removed from `index.html`, because Octane only adopts head elements it rendered on the server. With the static title in place it kept winning `document.title`.
- The logo label is now "Portfolio A.Durnev". The Owner changed `landing.json` before this ticket started, which settles the wording question Unit 1.0 left open. `messages.test.ts` follows it.
- `landing.feature` was already red before this ticket: it expected a "Portfolio" heading the Landing no longer renders. Its scenario now checks the document title "A.Durnev portfolio" instead. The logo steps find the button by its new name.
- `intlWrapper(overrides)` in `i18n/testing.ts` is the shared test wrapper: an `IntlProvider` with the English messages, some of them replaced. It is exported from the i18n index because three test files use it.
- `AnimatedLogo`'s `label` is now required, and its hard-coded "Home" default is gone, so no English text is left inside the logo.
- Review (standards and spec, in parallel) led to: the literal `LABEL_BY_HEALTH` map, a comment on the `useMemo` dependency list, `IntlContext` documented as internal to the binding, `intlWrapper` typed from `IntlProviderProps`, the type-only test saying where its check lives, the required logo label, and the Board title item added to portfolio-3n34. Not taken: the duplicated never-answering fetch stub in two tests (a nit), and splitting `i18n/types.ts`.

## Findings for later tickets

- The served HTML has no `<title>` until JS runs, so clients that don't run JS, such as link unfurlers, see none. Revisit with social/OG meta, Unit 8 at the latest.
- oxlint's `react-hooks/exhaustive-deps` (correctness category, so an error) rejects `useMemo`/`useCallback` without a dependency array. That contradicts the frontend rule "omit dependency arrays on built-in hooks". `IntlProvider` passes `[messages]`. The rule should name the exception, or the lint config should change.
- Bundle: FormatJS adds about 68 KB minified (about 20 KB gzipped) to `main.js` (190 KB → 259 KB), mostly the ICU parser used at run time. Precompiling the messages to ASTs (`formatjs compile --ast`) would leave the parser out.
- Unit 1.5: per-Panel titles can be another `<title>` rendered by the Board, as the Landing does.

## Summary of Changes

- `frontend/src/i18n/`: the FormatJS binding. `IntlProvider.tsrx` builds one `@formatjs/intl` object (locale `en`, shared cache) from the English messages, or from a `messages` override, and provides it through `IntlContext` (`context.ts`). `types.ts` registers `MessageId` as FormatJS's message ids, so `formatMessage({ id })` rejects unknown ids, and adds `Messages` and `IntlProviderProps`. `testing.ts` holds `intlWrapper(overrides)`, the shared test wrapper.
- `frontend/src/hooks/useIntl/`: the shared `useIntl()` hook. It returns the `IntlShape` and throws outside an `IntlProvider`. Its tests cover formatting by id with and without values, the type-level id check and the missing provider.
- `App` wraps everything in `IntlProvider`. `LandingPage` renders `<title>` from `site.title`, which Octane hoists into `<head>`, and takes the logo label from `landing.logo.label`. `ApiStatus` takes the badge text per health state from `landing.status.*` (`LABEL_BY_HEALTH`). `AnimatedLogo`'s `label` is required. `index.html` lost its static `<title>Portfolio</title>`.
- Tests: new `App.test.ts`, `LandingPage.test.ts` and `useIntl.test.ts`. `ApiStatus.test.ts` renders inside the provider and proves the text source with overrides. `messages.test.ts` follows the Owner's new logo label, "Portfolio A.Durnev".
- E2E: the landing scenario checks the document title "A.Durnev portfolio" (it was red before, on a heading that no longer exists). The logo steps find the button by its new name. `pnpm --dir frontend e2e`: 4 scenarios passed.
- The bundle holds no React or react-intl. Its source map lists only `@formatjs/*`, `intl-messageformat` and `octane`.
- portfolio-3n34 got an item for the Board's own document title.
