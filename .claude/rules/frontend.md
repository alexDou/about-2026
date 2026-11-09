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
- Document title: `index.html` carries the static site title, shown until JS runs and on every screen that sets none. A rendered `<title>` lands after it in `<head>` and never shows, so a screen sets `document.title` in an effect and restores the previous title on cleanup (see `LandingPage`).

## Domain code stays in its domain

- A hook, type, constant or helper that carries one domain's concepts lives in that domain's chunk, `components/domain/<Name>/` (`hooks/`, `types.ts`, `config.ts`), however many chunks use it. Example: `ApiStatus` owns `useApiHealth` and the `ApiHealth` type.
- Other chunks reach domain code through the domain's `index.ts`.
- The global `hooks/` and `utils/` hold domain-agnostic code only, such as `useIntl` and `useAnimationFrame`.

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
- Type checking: `tsrs --noEmit --fast --runExternalCode` (`pnpm typecheck`). `.tsrx` reaches tsrs through `@tsrx/content-mapper` (tsconfig `contentMappers` + `tsrx.compiler`). There is no `tsc`.
- `tools/octane-tsrx-mapper` is a 2-line shim: the mapper calls `compile_to_volar_mappings`, octane exports `compileToVolarMappings`. Remove it once upstream agrees on the name.
- Lint `oxlint`, format `oxfmt`, both from `@tsrx/oxc` (the only package that provides them). Never add the standalone `oxlint`/`oxfmt` packages: they shadow the `.tsrx`-aware binaries and skip every `.tsrx` file.
- Never add SWC, Babel, esbuild or a second transpiler. Prefer an Oxc tool whenever one exists.

## Types

- `type` aliases for props and data shapes, kept in the chunk's `types.ts`.
- Types that mirror backend responses follow `.claude/rules/api-contract.md`.
