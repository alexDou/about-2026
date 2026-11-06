---
paths: ["frontend/**/*.{ts,tsx,tsrx,css,mjs}"]
---
# Frontend: Octane, TSRX, TypeScript 7, Oxc toolchain

## Components are TSRX (`.tsrx`)

Syntax: https://tsrx.dev/features. Octane specifics: https://octanejs.dev/docs/tsrx-vs-tsx

- Every component file is `.tsrx`. Hooks, services, utils, types and tests stay `.ts`. Don't add `.tsx` components: Strong mode refuses them (`OCTANE_STRONG_TSX_MODULE`).
- Body form: `export function Name(props: NameProps) @{ setup statements…; <one output node> }`. Setup first, then exactly one output node (element, fragment, or a control-flow block). Nothing after it.
- Control flow uses blocks, not JSX tricks:
  - `@if (a) { … } @else if (b) { … } @else { … }` instead of `&&` / ternaries
  - `@for (const item of items; index i; key item.id) { … } @empty { … }` instead of `.map()`
  - `@switch (x) { @case 'a': { … } @default: { … } }`, `@try { … } @pending { … } @catch (e, reset) { … }`
  - No `return`/`break`/`continue` inside these blocks. For guard returns, use a plain function body with `return <X />`.
- Comments between children are `//` or `/* */`, not `{/* */}`.
- Import `.tsrx` modules with the extension: `export { Name } from "./Name.tsrx";`.

## Octane is not React

Octane gives the React API through a compiler. Differences that matter: https://octanejs.dev/docs/differences-from-react

- Use `class`, not `className`. clsx-style arrays and objects are allowed.
- Events are native DOM events. Use `onInput` for typing, not React's synthetic `onChange`.
- No rules of hooks. Omit hook dependency arrays: the compiler derives them from the closure. An explicit array keeps React semantics; `null` means every render.
- Test with `@octanejs/testing-library` (`render(Component, { props })`).

## Styling

- CSS Modules only (`styles.module.css`). No Tailwind, no CSS-in-JS.
- No `style` props. Oxlint enforces this (`react/forbid-dom-props`). Pass dynamic values through CSS custom properties set on a class, or SVG attributes.
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
