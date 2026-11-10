# Code Organization & Directory Structure

Modular code, split on reasonable borders. No big modules: when a file or folder starts doing two jobs, split it.

## The colocation rule

**Everything that belongs to one chunk of code lives inside that chunk.** A chunk is a component, page, hook or service folder.

- Code used by exactly one chunk lives in that chunk: its private hooks, helpers, types, styles, constants, sub-components and tests.
- Code used by two or more chunks moves up to the nearest shared level (see the layout below). Move it when the second consumer appears, not before. Domain code stays in its domain chunk instead (frontend.md, "Domain code stays in its domain").
- When the last other consumer goes away, move the code back down into the one chunk that still uses it.
- A chunk's `index.ts` is its public interface. Import another chunk only through its `index.ts`. Never deep-import another chunk's internal files.
- UI text is the one exception: messages live in `i18n/`, one file per page or area, and the chunk reads them by id through `useIntl()`.

## Frontend layout (`frontend/src/`)

```
app/                          root component
pages/<Page>/                 route-level screens
components/ui/<Name>/         presentational building blocks, no data fetching
components/domain/<Name>/     feature components, may use hooks and services
hooks/<useX>/                 shared domain-agnostic or app-wide hooks only (used by 2+ chunks)
services/<area>/              API clients, no UI
utils/                        shared domain-agnostic or app-wide pure helpers only (used by 2+ chunks)
i18n/                         FormatJS setup and the message files (ADR 0003)
styles/                       global CSS (tokens, fonts and their license in media/)
public/                       files served as-is from the site root (robots.txt); sibling of src/, not a chunk
```

A chunk folder, with the optional parts in brackets:

```
components/domain/ProjectCard/
  ProjectCard.tsrx            the component (TSRX)
  _specs_/                    its unit tests (ProjectCard.test.ts, …)
  index.ts                    public exports
  types.ts                    its props and private types
  styles.module.css           its styles
  [config.ts]                 its constants
  [utils.ts | utils/]         its private helpers (tests in _specs_/)
  [media/]                    its media files: images, icons, fonts
  [hooks/useX/]               its own hooks: useX.ts, index.ts, [types.ts]
  [components/<Sub>/]         sub-components only it renders, same shape recursively
```

- Every component folder has `<Name>.tsrx`, `index.ts`, `types.ts` and `styles.module.css`. Props types never go inline in the `.tsrx`. Components never share a stylesheet.
- Hook folders have `useX.ts` and `index.ts`, plus `types.ts` for types of their own. A domain hook takes its types from the domain's `types.ts`.
- `components/ui/` holds no data fetching. Anything that calls a hook backed by a service is `components/domain/`.

## Tests

- Unit tests sit in the chunk's `_specs_/` folder: `_specs_/<Name>.test.ts` or `_specs_/<file>.test.ts` (`.test.tsx` only when the test itself needs JSX). The same holds in `frontend/tools/`.
- Media files (images, icons, fonts) sit in the chunk's `media/` folder.
- Frontend E2E (Cucumber + Playwright) lives in `frontend/e2e/{features,steps,support}/`.
- Backend tests live in `backend/tests/`, mirroring `backend/app/` (`app/routes/projects.py` → `tests/routes/test_projects.py`).

## Backend layout (`backend/app/`)

Same colocation rule, Python-style: one module or package per feature area. A helper used by one router lives in that router's package. Shared code moves up to a shared module only when a second area needs it.
