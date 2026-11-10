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

## Declarative, conventional React

- Write declarative React: state, props, context and JSX event props (`onAnimationEnd`, `onTransitionEnd`, `onClick`). State two or more components need lives in one place (a module of signals, see "Shared state: signals"), not in a hook that reads the DOM.
- Do not reach for the DOM or the browser's animation state to learn what the UI is doing: no `addEventListener` on elements, `getAnimations`, `querySelector`, `requestAnimationFrame` loops or imperative `.focus()` calls. A component that knows something reports it through a prop or context.
- Imperative code is the exception: it needs the user's agreement before it is written, each time. When a browser API leaves no declarative way (a `meta` tag, `scrollTo`, a global key listener), say so and ask first.
- Where an effect is left, it only syncs state with something outside React, and cleans up after itself.

## Shared state: signals

- State several components read and change is an Octane signal, shared as a module: the module holds one scope (`createScope`), one signal whose value is the state, derived signals for what components read, and plain functions that change it. Components import the handles and the functions directly; no context, no props for it. Example: `components/domain/Board/motion/motion.ts`. Use it where the thing is one per document (one Board). Keep the rules of the state in plain pure functions next to it (`sequence.ts`), tested without the framework.
- The route decides what shows at rest, as the router does for the page. The shared state holds only what is in flight, and the component falls back to the route while the state has not started (`stage$.get() ?? settledStage(board)`).
- State that belongs to a mount resets when its owner unmounts (`useEffect(() => reset, [])`), so the next mount starts from scratch.
- A handle, and any function that returns handles, has a name ending in `$` (`stage$`); the compiler refuses otherwise.
- Every module that reads a handle while rendering has a runtime `import "octane/signals";` (allowed in `.oxlintrc.json`).
- A signal is written from event handlers and effects, not while a component renders or commits: not in a layout effect, and signals cannot be created during a render either (module level is fine).
- A `derived$` renders its readers again whenever one of its inputs changes, even when its own value does not. Cheap here; do not rely on it to skip renders.
- Tests: the pure functions are unit-tested with plain values; a component test sets the signals through the module's own functions (`go(...)`) and asserts on the state or on what shows; a test file resets in `afterEach` where no Board unmounts. Integration tests check what a visitor sees (`BoardSequence.test.ts`).

## No hardcoded values

- Strong preference: a value with a meaning (a kind, a state, a stage, a tone, a CSS property a stage waits for) is a named constant in the chunk's `config.ts`, as an `as const` object, with its type derived from it (`(typeof BOARD_KIND)[keyof typeof BOARD_KIND]`). Code compares and assigns through the constant (`BOARD_KIND.expanded`), never through a string spelled out again.
- Examples: `BOARD_KIND` (`hooks/useRoute/config.ts`), `STAGE_VIEWS` (Board), `SLOT_VIEWS` (Slot), `API_HEALTH` (ApiStatus), `STATUS_TONES` (StatusBadge), DOM selectors as named constants.
- Fine as written: message ids (typed `MessageId`), CSS Module class keys (`styles["panel"]`), Web API names used once where the API is called (`"keydown"`), values that mirror the backend contract, and the expected values in tests (a test may also use the constants).
- A constant module and its types module do not import each other both ways: the types derive from the constants, and the constants never import the types (see "Imports form no cycles").

## Routing

- Routing runs on `@octanejs/tanstack-router` (ADR 0004) with code-defined routes. Do not add file-based routes or a route generator. The router matches the URL and renders the screen: no component switches on the route to pick what to show.
- Route tree: the root route's component is `App` (messages and an `Outlet`); `/` is the Landing; the Board is a pathless layout route whose `Outlet` shows the Expanded panel's page; `/explore` and one route per Panel sit under it, and a Panel route carries `staticData: { panel }`. The tree lives in `hooks/useRoute/router.ts` (`createAppRouter`) and takes its components as required options, so it imports no page. `app/router.ts` (`createSiteRouter`) supplies the real ones.
- `hooks/useRoute` is the one place that imports `@octanejs/tanstack-router`: `useRoute()` gives `{ board, navigate, link }` (`board` is the Board state of the matched route; the default Board where no Board shows), and the index re-exports `Outlet` and `RouterProvider`. Test helpers, exported like `intlWrapper` (the production bundle tree-shakes them out): `testRouter({ board, pages, … })` makes a router whose components render nothing unless named, `routerWrapper` puts one in context, and `test-setup.ts` destroys every `testRouter` history after each test.
- A `BoardState` is what `navigate` and `link` take. Panel titles and Stripes are plain `<a href>` elements with `link(board)`'s `onClick` (a plain click navigates in the app, a modified click is left to the browser).
- The site keeps no record of what caused a route change: every change plays the same transition. Do not bring back a `userTriggered` flag.
- Navigation is asynchronous: tests that click a link or render a route tree wait for it (`await router.load()` inside `act`, `waitFor`, `findBy…`). A test of a routed component renders `RouterProvider` with a `testRouter` and stub pages.
- `@tanstack/router-core` is a direct dependency, pinned to the version the binding pins, only so `StaticDataRouteOption` can be typed (`hooks/useRoute/types.ts`). Move both together.
- A visit to a path with a trailing slash is replaced where the router is made, and an unknown path by a catch-all route, both without a history entry.

## The Board's motion

- Every Panel has one `Slot` (`components/domain/Board/components/Slot/`): its `<li>` keeps the tone and the size, and only the size transitions. The view inside (Panel, Stripe or Expanded panel) is one wrapper that fades; the hidden view is `inert`.
- The Board's motion is a module of signals (`components/domain/Board/motion/motion.ts`): `stage$`, `busy$`, `entering$` and the functions `go`, `slotResized`, `viewFaded`, `titleShown`, `scrollStarted`, `scrollEnded`, `reset`. `sequence.ts` is the pure planner and state functions. `useBoardSync(board)` is the Board's one hook for it: the route into `go`, `reset` on unmount.
- Until the first route change `stage$` is `null` and the route decides what the Board shows; from then on it is the stage on screen. The stage the sequence plays towards is where the queue ends, so the motion keeps no copy of the route. A stage is a class change. It ends when everything it waits for has reported: a slot's `transitionend` on `flex-grow`, a view's on `opacity` (`onTransitionEnd` on the Slot), by Panel. The planner knows which (`awaitedBy`); a stage that waits for nothing is skipped. No timers, no `getAnimations`. With reduced motion every stage is skipped and there is no entrance.
- The entrance is the titles' fade-in: each Panel reports `onAnimationEnd` of its title, and the entrance plays until all five have. Only a slot that shows the Panel unfolds. Opening a Panel ends it, so Panels that come back do not replay it.
- A click on a Stripe from a scrolled page scrolls up first (`scrollingUpFirst`) and changes the route when the page has: the route change removes the page, and the browser would clamp the scroll with it. Back and Forward do not wait for a scroll.
- The Board is `busy` while the entrance plays, a stage runs or the page scrolls up; clicks, the close button and Escape are ignored then (`ignoredWhileBusy`). The route reaches the motion in an effect, so the stage follows the route a frame later; the page shows in the slot the route names.
- The durations are the `--seq-*` and `--enter-*` custom properties in `styles/tokens.css`. `useBoardFocus` moves focus when the Board comes to rest, not on the route change.
- Tests fire the browser's events by hand: `transitionend` with a `propertyName` on the slots or views, `animationend` on the titles (`_specs_/BoardSequence.test.ts`, `BoardEntrance.test.ts`); jsdom animates nothing, so a test of something else asks for reduced motion.

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
