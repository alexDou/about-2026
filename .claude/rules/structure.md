# Code Organization & Directory Structure

Modular code, split on reasonable borders. No big modules: when a file or folder starts doing two jobs, split it.

## The colocation rule

**Everything that belongs to one chunk of code lives inside that chunk.** A chunk is a component, page, hook or service folder.

- Code used by exactly one chunk lives in that chunk: its private hooks, helpers, types, styles, constants, sub-components and tests.
- Code used by two or more chunks moves up to the nearest shared level (see the layout below). Move it when the second consumer appears, not before. Domain code stays in its domain chunk instead (frontend.md, "Domain code stays in its domain").
- When the last other consumer goes away, move the code back down into the one chunk that still uses it.
- A chunk's `index.ts` is its public interface. Import another chunk only through its `index.ts`. Never deep-import another chunk's internal files.
- UI text is the one exception: messages live in `i18n/`, one file per page or area, and the chunk reads them by id through `useIntl()`.

## Naming

- **Folders are kebab-case**: every chunk folder (pages, `components/ui/`, `components/domain/`, sub-components, hooks) and the folders in them. `board`, `api-status`, `pages/chat-with-me`, `ui/badge-frame`, `hooks/use-route`, `about/badges/ai-ready-badge`.
- **A folder is named after its main file**, kebab-cased: `api-status/` holds `ApiStatus.tsrx`, `use-api-health/` holds `useApiHealth.ts`. A page folder drops the `Page` suffix: `pages/about/` holds `AboutPage.tsrx` (`pages/what-i-do/` → `WhatIDoPage.tsrx`).
- **The main file keeps its code name**: a component file is PascalCase (`ApiStatus.tsrx`), a hook file is `useX.ts`. Other files are lowercase single words (`index.ts`, `types.ts`, `config.ts`, `utils.ts`, `styles.module.css`) or kebab-case (`health.ts`, `site-shell.test.ts`).
- **`i18n/` is the exception**: its files are kebab-case, components included (`intl-provider.tsrx`, `intl-context.ts`); messages are in `en/messages.ts` and the `intlWrapper` test helper in `_specs_/testing.ts`.
- **A page folder holds the page only**: `<Page>.tsrx`, `index.ts`, `types.ts`, `styles.module.css`, tests, and what the page owns and passes down as props: its `content/` (the text's shape and ids) and `media/`. Everything it renders is a component in `components/ui/` or `components/domain/<area>/`, named for what it does (`AboutStatusBadges`, not `AvailabilityBadges`).
- **Dependencies point one way**: pages import components, components never import a page. A component declares the types of its own props; the page passes data whose type matches structurally. No page type is imported by a component, and none is shared up to a page from a component. Constants a component compares against (its kinds) live in that component's `config.ts`.
- **Fonts and their licence are global**: `styles/fonts/` holds every font file and one `OFL.txt` that covers them all (`fonts.css` declares the `@font-face` rules).

## Frontend layout (`frontend/src/`)

```
app/                          root component
pages/<page>/                 route-level screens, the page only
components/ui/<name>/         presentational building blocks, no data fetching
components/domain/<area>/     feature components, may use hooks and services; one folder per component, or per area (about/)
hooks/<use-x>/                shared domain-agnostic or app-wide hooks only (used by 2+ chunks)
services/<area>/              API clients, no UI
utils/                        shared domain-agnostic or app-wide pure helpers only (used by 2+ chunks)
i18n/                         FormatJS setup and the message files (ADR 0003)
styles/                       global CSS (tokens, fonts/ with the font files and their license)
public/                       files served as-is from the site root (robots.txt); sibling of src/, not a chunk
```

A chunk folder, with the optional parts in brackets:

```
components/domain/project-card/
  ProjectCard.tsrx            the component (TSRX)
  _specs_/                    its unit tests (ProjectCard.test.ts, …)
  index.ts                    public exports
  types.ts                    its props and private types
  styles.module.css           its styles
  [config.ts]                 its constants
  [utils.ts | utils/]         its private helpers (tests in _specs_/)
  [media/]                    its media files: images, icons, video
  [fonts/]                    its font files (woff2, ttf, …) and their licenses
  [hooks/use-x/]              its own hooks: useX.ts, index.ts, [types.ts]
  [components/<sub>/]         sub-components only it renders, same shape recursively
```

- Every component folder has `<Name>.tsrx`, `index.ts`, `types.ts` and `styles.module.css`. Props types never go inline in the `.tsrx`. Components never share a stylesheet.
- Hook folders have `useX.ts` and `index.ts`, plus `types.ts` for types of their own. A domain hook takes its types from the domain's `types.ts`.
- `components/ui/` holds no data fetching. Anything that calls a hook backed by a service is `components/domain/`.

## Tests

- Unit tests sit in the chunk's `_specs_/` folder: `_specs_/<Name>.test.ts` or `_specs_/<file>.test.ts` (`.test.tsx` only when the test itself needs JSX). The same holds in `frontend/tools/`.
- Media files (images, icons, videos) sit in the chunk's `media/` folder.
- Frontend E2E (Cucumber + Playwright) lives in `frontend/e2e/{features,steps,support}/`.
- Backend tests live in `backend/tests/`, mirroring `backend/app/` (`app/routes/projects.py` → `tests/routes/test_projects.py`).

## Backend layout (`backend/app/`)

Same colocation rule, Python-style: one module or package per feature area. A helper used by one router lives in that router's package. Shared code moves up to a shared module only when a second area needs it.
