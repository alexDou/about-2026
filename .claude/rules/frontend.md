---
paths: ["frontend/**/*.{ts,tsx,tsrx,css,mjs}"]
---
# Frontend: Octane, TSRX, TypeScript 7, Oxc toolchain

## Components are TSRX (`.tsrx`)

Syntax: https://tsrx.dev/features.

- Every component file is `.tsrx`. Hooks, services, utils, types and tests stay `.ts`. Don't add `.tsx` components: they compile to element descriptors instead of templates, and Strong mode refuses them (`OCTANE_STRONG_TSX_MODULE`).
- Body form: `export function Name(props: NameProps) @{ setup statements…; <one output node> }`. Setup first, then exactly one output node (element, fragment, or a control-flow block). Nothing after it.
- Control flow uses blocks, not JSX tricks:
  - `@if (a) { … } @else if (b) { … } @else { … }` instead of `&&` / ternaries
  - `@for (const item of items; index i; key item.id) { … } @empty { … }` instead of `.map()`
  - `@switch (x) { @case 'a': { … } @default: { … } }`, `@try { … } @pending { … } @catch (e, reset) { … }`
  - No `return`/`break`/`continue` inside these blocks. For guard returns, use a plain function body with `return <X />`.
- Comments between children are `//` or `/* */`, not `{/* */}`.
- Import `.tsrx` modules with the extension: `export { Name } from "./Name.tsrx";`.

## Project specific choices:

- Write `class`, not `className`.
- Omit dependency arrays on built-in hooks. Write one only when you need exact control over when it reruns.
- Test with `@octanejs/testing-library` (`render(Component, { props })`).
- E2E contexts run with reduced motion, so the Board's entrance does not disturb measurements. A scenario about motion starts with `Given the visitor accepts motion`.
- Document title: `index.html` carries the static site title, shown until JS runs and on every screen that sets none. A rendered `<title>` lands after it in `<head>` and never shows, so a screen sets the title through `useDocumentTitle`, which restores the previous title on cleanup.

## Routing

- Routing runs on `@octanejs/tanstack-router` (ADR 0004) with code-defined routes. Do not add file-based routes or a route generator. The router matches the URL and renders the screen: no component switches on the route to pick what to show.
- Route tree: the root route's component is `App` (messages and an `Outlet`); `/` is the Landing; the Board is a pathless layout route whose `Outlet` shows the Expanded panel's page; `/explore` and one route per Panel sit under it, and a Panel route carries `staticData: { panel }`. The tree lives in `hooks/useRoute/router.ts` (`createAppRouter`) and takes its components as required options, so it imports no page. `app/router.ts` (`createSiteRouter`) supplies the real ones.
- `hooks/useRoute` is the one place that imports `@octanejs/tanstack-router`: `useRoute()` gives `{ board, navigate, link }` (`board` is the Board state of the matched route; the default Board where no Board shows), and the index re-exports `Outlet` and `RouterProvider`. Test helpers, exported like `intlWrapper`: `testRouter({ board, pages, … })` makes a router whose components render nothing unless named, and `routerWrapper` puts one in context.
- A `BoardState` is what `navigate` and `link` take. Panel titles and Stripes are plain `<a href>` elements with `link(board)`'s `onClick` (a plain click navigates in the app, a modified click is left to the browser).
- The site keeps no record of what caused a route change: every change plays the same transition. Do not bring back a `userTriggered` flag.
- Navigation is asynchronous: tests that click a link or render a route tree wait for it (`await router.load()` inside `act`, `waitFor`, `findBy…`). A test of a routed component renders `RouterProvider` with a `testRouter` and stub pages.
- `@tanstack/router-core` is a direct dependency, pinned to the version the binding pins, only so `StaticDataRouteOption` can be typed (`hooks/useRoute/types.ts`). Move both together.
- A visit to a path with a trailing slash is replaced where the router is made, and an unknown path by a catch-all route, both without a history entry.

## Domain code stays in its domain

- A hook, type, constant or helper that carries one domain's concepts lives in that domain's chunk, `components/domain/<Name>/` (`hooks/`, `types.ts`, `config.ts`), however many chunks use it. Example: `ApiStatus` owns `useApiHealth` and the `ApiHealth` type.
- Other chunks reach domain code through the domain's `index.ts`.
- The global `hooks/` and `utils/` hold domain-agnostic or app-wide code only: `useAnimationFrame`, `useIntl`, and `useRoute`, because navigation is site-wide even though it names the Panels and the Board state.

## Imports form no cycles

- The import graph is acyclic. Type-only imports and re-exports count.
- `pnpm cycles` (`tools/import-cycles.ts`) checks `src`, `e2e` and `tools` in the gate. oxlint's `import/no-cycle` cannot follow `.tsrx` imports, so it covers `.ts` modules only.
- Break a cycle by moving the shared piece into a module both sides import: types into `types.ts`, constants into `config.ts`.

## Styling

- CSS Modules only (`styles.module.css`), not Octane's scoped `<style>` blocks or themes. No Tailwind, no CSS-in-JS.
- Pass dynamic values through CSS custom properties set on a class, or SVG attributes.
- Global tokens live in `src/styles/`.

## Toolchain (Oxc only)

- Package manager: **pnpm only** (`pnpm`, `pnpm exec`, `pnpm dlx`, `pnpm view`). Never `npm` or `npx`.
- TS is stripped by `tools/oxc-loader.mjs` (oxc-transform), JS minified by `tools/oxc-minify-plugin.mjs` (oxc-minify), CSS by Lightning CSS.
- `@octanejs/tanstack-router` ships TypeScript source, so the Oxc loader rule in `rspack.config.ts` includes it (every other package in `node_modules` is skipped), and tsconfig does not set `erasableSyntaxOnly` because tsrs type-checks that source too and it uses a parameter property. Oxc strips such syntax, so the build is unaffected. oxlint's `typescript/parameter-properties` keeps parameter properties out of our own code; enums and namespaces are not checked.
- Type checking: `tsrs --noEmit --fast --runExternalCode` (`pnpm typecheck`). `.tsrx` reaches tsrs through `@tsrx/content-mapper` (tsconfig `contentMappers` + `tsrx.compiler`). There is no `tsc`.
- `tools/octane-tsrx-mapper` is a 2-line shim: the mapper calls `compile_to_volar_mappings`, octane exports `compileToVolarMappings`. Remove it once upstream agrees on the name.
- Lint `oxlint`, format `oxfmt`, both from `@tsrx/oxc` (the only package that provides them). Never add the standalone `oxlint`/`oxfmt` packages: they shadow the `.tsrx`-aware binaries and skip every `.tsrx` file.
- Never add SWC, Babel, esbuild or a second transpiler. Prefer an Oxc tool whenever one exists.
- Message files in `src/i18n/` are FormatJS AST JSON, and the bundle has no ICU parser (`no-parser` alias in `rspack.config.ts`). There is no build step. To add or edit a message, write it as an ICU string in a scratch file `{ "id": "…" }` outside the repo, run `pnpm dlx @formatjs/cli compile <file> --format simple --ast`, and paste the output into the area file. Tests check that every message formats; test overrides (`intlWrapper`) take ICU strings.

## Types

- `type` aliases for props and data shapes, kept in the chunk's `types.ts`.
- Types that mirror backend responses follow `.claude/rules/api-contract.md`.
