# about-2026

Portfolio site representing my abilities.

| Part        | Stack |
|-------------|-------|
| `frontend/` | **Octane** SPA (React-style, compiled) · **TSRX** components (`.tsrx`) · TypeScript 7 checked by **tsrs** · **Rspack** bundler · Oxc for TS stripping + minify · CSS Modules · Vitest · Oxlint + Oxfmt via `@tsrx/oxc` · Playwright + Cucumber-js |
| `backend/`  | Python 3.13 · FastAPI · uv · pytest · ruff |
| `logo/`     | Animated logo prototype (to be ported into the landing page) |

## Run

```sh
cd backend  && uv sync && uv run fastapi dev   # :8000
cd frontend && pnpm install && pnpm dev        # Rspack dev server :5173, proxies /api -> :8000
```

## Check

```sh
cd frontend && pnpm check && pnpm e2e   # typecheck, lint, fmt, unit, cucumber
cd backend  && uv run ruff check . && uv run pytest
```

Styling rules: CSS Modules only (`*.module.css`). No Tailwind, no CSS-in-JS, no `style` props (Oxlint enforces the last one).

## Frontend layout

```
src/
  app/                 root component
  pages/<Page>/        route-level screens
  components/ui/       presentational building blocks (no data fetching)
  components/domain/   feature components (use hooks/services)
  hooks/<useX>/        reusable hooks
  services/<area>/     API clients, no UI
  styles/              global CSS (tokens)
```

Every component folder has `<Name>.tsrx`, `styles.module.css`, `types.ts`, `index.ts` (public exports), plus `<Name>.test.ts` when it has tests.
Components are TSRX (`@{ }` bodies, `@if`/`@for`/`@switch`), see https://tsrx.dev/features.
Octane uses `class` (clsx-style arrays and objects are allowed) and native DOM events (`onInput` for typing). See https://octanejs.dev/docs/differences-from-react.
