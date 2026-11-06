---
paths: ["frontend/**/*.{ts,tsx,tsrx,css,mjs}"]
---
# Octane: what differs from React

Condensed from https://octanejs.dev/docs (fetched 2026-11-07, Octane 0.16.7). Octane is React 19's component and hook API, compiled ahead of time into template clones and direct DOM writes: no virtual DOM, no diffing. **Anything not listed here behaves like React 19.** Octane is beta, so its APIs can still change. Look up a detail on the page linked in each heading.

## Roots and rendering ([core-apis](https://octanejs.dev/docs/core-apis))

- `createRoot(el).render(App, props)` and `hydrateRoot(el, App)` take the component and its props, not an element.
- `createPortal(Component, target, props)` takes the same component + props shape. Events bubble through the logical tree (context crosses too), while listeners added with `addEventListener` follow the physical DOM.
- A `<title>` rendered anywhere is hoisted into `<head>`, so no effect is needed for it.

## Hooks ([differences-from-react](https://octanejs.dev/docs/differences-from-react))

- **No rules of hooks.** The compiler gives each call site its own slot, so a hook can sit behind a condition or after an early return. A skipped hook keeps its state. An effect a render returned before reaching is cleaned up, and it runs again once a render reaches it.
- **Exception:** a slot-keyed hook inside a plain JS loop is a compile error. Use a keyed `@for` or a child component instead. `use()` and `useContext` are exempt.
- **Dependency arrays are optional** on `useEffect`, `useLayoutEffect`, `useInsertionEffect`, `useMemo`, `useCallback` and `useImperativeHandle`. When omitted, the compiler infers them from the closure and knows that setters, dispatchers, refs and state getters are stable.
  - An explicit array keeps React's meaning (`[]` = mount only). `null` = every render.
  - Built-in hook calls infer their dependencies in every compiled module, `.ts` custom hooks included.
  - A *call to a custom wrapper hook* infers only when the wrapper is declared locally in a `.tsrx`/`.tsx` module and passes its callback and last parameter straight through. Imported wrappers, method-style wrappers, wrappers declared in `.ts` files and wrappers that transform their arguments all need an explicit list.
  - Never list an Effect Event (`useEffectEvent`) as a dependency.
- `useState` and `useReducer` return a stable third item: `[value, set, getValue]`. `getValue()` reads the latest scheduled state without subscribing. Use it in async or delayed callbacks instead of mirroring state into a ref.
- Octane-only hooks and helpers (all from `octane`):
  - `useLinkedState(source, (next, prev) => value, opts?)`: editable state that resets or adjusts as soon as `source` changes. `prev` is `{ source, value }`, or `undefined` on first render. It replaces "sync a prop into state with an effect".
  - `useLazyRef(factory)`: a ref whose value is created once. It replaces `if (ref.current === null) ref.current = create()`.
  - `useLayoutSnapshot(() => measure(), { initial, equal? })`: renders from a DOM measurement taken after commit and before paint. It replaces `useLayoutEffect(() => setX(measure()))`, but does not observe resizes between commits.
  - `createResizeObserver(cb)`: a native `ResizeObserver` that delivers coalesced entries in a separate task. Use it whenever a resize callback sets state or writes layout; it avoids the "ResizeObserver loop completed" error. Clean up with the returned instance's `disconnect()` or `unobserve()`.
- `useRef(fn)` stores the function itself. `useDebugValue` exists but does nothing.

## Events and forms

- Handlers receive the browser's real `Event` (delegated, no synthetic layer). Capture, `stopPropagation()` and native mouse/pointer enter/leave all work.
- **Text fields: `onInput` for every edit.** `onChange` is the native `change` event, which fires on commit, usually on blur. There are no synthetic `onChange`, `onBeforeInput` or `onSelect`.
  - The compiler warns with `OCTANE_NATIVE_TEXT_ONCHANGE`. Fix it with `onInput` (or `onInputCapture`).
  - For a deliberate save-on-blur, keep `onChange` and add the non-rendered `suppressNativeChangeWarning` prop.
  - None of this applies to `select`, checkbox, radio, file or custom elements, or to component props named `onChange`.
- Controlled `value`/`checked` behave exactly like React. `defaultValue`/`defaultChecked` are the uncontrolled form.
- Checkbox and radio events fire in the native order: `click` → `input` → non-cancelable `change`. Calling `preventDefault()` in `onChange` cannot undo the toggle; cancel in `onClick` instead.
- `useActionState`, `useFormStatus`, `useOptimistic` and `requestFormReset(form)` work as in React. One difference: a rejected action does not cancel the actions queued after it.

## Props, refs, context

- `class` (or `className`) composes clsx-style from strings, arrays, objects and nesting, with falsy values dropped. `['a','b']` renders `"a b"`; React would give `"a,b"`.
- `ref` is an ordinary prop on components. There is no `forwardRef` and no `createRef`. Pass `ref={[a, b]}` to attach several refs.
- Provide context by rendering it directly: `<Theme value={v}>`. `Theme.Provider` is unsupported (`OCTANE_CONTEXT_PROVIDER`). `use(Theme)` and `useContext(Theme)` are equivalent.

## Async, Suspense, errors

- Creating a promise during render is the supported pattern. The compiler memoizes each promise that feeds a `use()` (`.then` chains included), keyed on its real inputs. Leave out React's `cache()`, and don't hoist fetches into effects or state to avoid re-creating them.
- Independent `use()` calls start in parallel and suspend once. Dependent ones stay sequential.
- No class components, so error boundaries are `@try { } @pending { } @catch (error, reset) { }` in `.tsrx`, or the `ErrorBoundary fallback={…}` component. Uncaught errors go to `console.error`.
- Production builds shorten framework errors to Octane's own codes (not React's numbers). Decode them at https://octanejs.dev/errors or with `octane explain '<message>'`.

## Scheduling

- Urgent updates are batched in a microtask, and transition updates render in a later task. Every render runs to completion: no lanes, no time slicing, no selective hydration.
- `isPending` commits first, so the browser can paint it before the transition renders. `flushSync` drains the whole update queue.
- `useDeferredValue` renders can't be interrupted, so wrap the slow child in `memo`.

## Left out on purpose

Class components, legacy roots, Server Components / RSC / `cache()`, `StrictMode` double-invoke, `Profiler`, `SuspenseList`, `forwardRef`, `createRef`, and most `React.Children` utilities (keyed `@for` is the collection API). `Activity`, `ViewTransition`, `lazy`, `memo`, `useId`, `useSyncExternalStore` and the resource hints (`preload`, `preinit`, `preconnect`, `prefetchDNS`) all exist.

## TSRX, Octane's dialect ([tsrx-vs-tsx](https://octanejs.dev/docs/tsrx-vs-tsx), syntax at https://tsrx.dev/features)

- `.tsrx` and `.tsx` share one runtime. `.tsrx` adds template control flow (`@if`, `@for`, `@switch`, `@try`), the `@{ … }` body, text holes, and a keyed fast path for `@for`. `.tsx` JSX compiles to element descriptors instead of templates.
- An `@{ … }` body is setup statements followed by exactly one output node. A `@{ … }` nested inside JSX is a child render scope: it can capture parent locals and has its own hook state.
- Inside a directive arm, a bare expression statement is setup and renders nothing. `@if (x) { value; }` outputs nothing; write `<>{value}</>` to render it.
- Use a text hole `{expr as string}` when the compiler can't prove `expr` is a string (literals and string concatenation need no cast). Leave `{expr}` bare for any renderable value. The cast only affects compilation.
- A keyed `.map()` returning JSX still works outside Strong mode, but `@for (…; key item.id) { } @empty { }` is the preferred form.

## Scoped `<style>` blocks ([styling](https://octanejs.dev/docs/styling))

- In `.tsrx`, a `<style>` block styles its siblings and everything below them, never the element that contains it. Its selectors and the elements it reaches share a hash class.
  - Put the block and the markup it styles in one fragment: `<><style>…</style><div/></>`.
  - The CSS is static. Pass runtime values through CSS custom properties.
- `const theme = <style>…</style>` creates a class map with `theme.$class` plus one key per class. `<style apply={theme} />` applies it to a scope.
- `:global(…)` is allowed only at the start or end of a selector. Keyframe names are scoped unless declared with `-global-name`.
- This CSS is shipped inside the JS through `injectStyle`. The bundler's CSS pipeline (CSS Modules, Lightning CSS, PostCSS) never processes it.

## Signals, Octane-only ([signals](https://octanejs.dev/docs/signals))

- `signal$`, `derived$` (can be async; inside, `await read(x$)` keeps tracking) and `query$(select, load)` (return `skip` from `select` to stay idle) come from `octane/signals`. `useSignal$` comes from `octane/signals/client`.
- Handles have `.get()`, which subscribes when called during render, and `.set(v | fn)`, `.latest(fallback)`, `.snapshot()` (idle, pending, ready or error) and `.refetch()` / `.reset()`. Use `createScope` for state whose lifetime you manage, and `optimistic$` / `action$` for optimistic saves.
- Every module that reads a signal during render needs a runtime import from `octane/signals*`. Add `import 'octane/signals'` if it imports nothing else from there.
- End handle names with `$`. Module-level signals are shared per document (per request on the server).

## Strong mode, opt-in ([strong-mode](https://octanejs.dev/docs/strong-mode))

- Enable it with a leading `'use strong'` directive placed before any imports, or for the whole app with `new OctaneRspackPlugin({ strong: true })`. A standalone Rspack setup does not read `octane.config.ts`.
- It is a pure-render contract:
  - Rejected during render: setting state, reading or writing `ref.current`, calling a state getter, reading clocks, randomness or browser globals, and mutating snapshots.
  - Rejected in effects: a synchronous state update during setup, and an explicit effect dependency list that differs from the inferred one.
  - Rejected elsewhere: `.map()` returning JSX, index keys, `.tsx`/`.jsx` modules, and raw `dangerouslySetInnerHTML` (wrap the value in `trustHTML(sanitized)`).
- Replacements: `useLazyRef`, `useLayoutSnapshot`, `useLinkedState`, `useEffectEvent`, `useSyncExternalStore`, `useId`.
- The compiler memoizes render work, so never rely on how many times a render runs. `octane explain OCTANE_STRONG_<CODE>` prints a code's fix.

## Build ([build-tools](https://octanejs.dev/docs/build-tools))

- `@octanejs/rspack-plugin` is a low-level plugin. It compiles `.tsrx`/`.tsx`, picks the client or server runtime from the Rspack target and handles HMR. Options: `transpile: false` when another loader strips TypeScript, `hmr: false`, `strong`, `environment`.
- Server-only APIs: `octane/server` (`renderToString` returns `{ html, css }`), `<Hydrate when={…}>` and `attachBehaviorRoot`.

## React libraries ([bindings](https://octanejs.dev/docs/bindings), [react-compat](https://octanejs.dev/docs/react-compat))

- React-facing libraries don't run on Octane. Install the `@octanejs/*` port, which keeps the library's API under a new import path (`zustand` → `@octanejs/zustand`). `pnpm dlx @octanejs/cli add <react-pkg>` finds the port and lists how it diverges from upstream. Ports are beta, so check that the part you need is covered.
- Ports relevant here: `@octanejs/testing-library` and `@octanejs/i18next`. There is **no react-intl port**.
- A library with no port can run inside `ReactCompat` from `octane/react`. That bundles real React 19.2+ and creates a separate root per island.
- CLI (`pnpm dlx @octanejs/cli …`): `doctor` checks the setup, `analyze` reports every compiler diagnostic, `explain` decodes an error.
