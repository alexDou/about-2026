# TanStack Router (Octane binding) instead of our own route hook

Routing runs on TanStack Router through `@octanejs/tanstack-router`, the Octane binding that reuses `@tanstack/router-core` and swaps the React binding for Octane's hooks. The seven URLs are code-defined routes: the Landing, and the Board as a layout route with one page route per Panel, so the router, not a component, decides what is shown. The Panel ids, their order and their paths stay ours, and the routes are built from them. A change of route never says what caused it: every change plays the same transition, so the site keeps no "was this a click?" flag and no record of what was open before.

Unit 1.3 built its own route hook over the History API, for three reasons: the route set is tiny, a React router would only run in a `ReactCompat` island, and the Board had to animate only after a user action (`userTriggered`). The second and third reasons fell away. The binding exists and its peer dependency (`octane ^0.16`) matches ours, and the cause-dependent animation was dropped: Back/Forward and loads animate like clicks, because telling them apart would mean tracking what was open before and animating conditionally. What remains of the custom hook is code a router already provides and tests: link handling, canonical-URL replacement, scroll handling, and the History API wiring.

## Considered Options

- Keep the own route hook (about 100 lines plus tests): smallest bundle and no dependency, but every URL feature stays ours to build (search params, not-found, scroll reset, typed links).
- `@tanstack/react-router` inside `ReactCompat` islands: ships React and ReactDOM beside Octane, and the router would own a React tree that cannot render the Octane Board.
- File-based routes (the router's code generator): needs a build step. We keep builds free of custom steps, and seven routes need no generator.

## Consequences

- The binding is 0.x and pins `@tanstack/router-core` exactly. Upgrades are deliberate, one bean each.
- `router-core` is larger than the hook it replaces. Measured on the migration (`pnpm --dir frontend build`, `main.js` gzip -9): 73,112 B before, 127,155 B after (+54,043 B, +74%). `main.css` is unchanged (3,194 B). The binding is not tree-shaken to what the site uses (the source map lists 45 modules from `@tanstack/router-core` and the binding).
- The binding ships TypeScript source. The bundler's Oxc rule includes it, and the type check had to drop `erasableSyntaxOnly` because the binding uses a parameter property.
- A trailing slash is not canonicalised by the router (it treats `/explore/` and `/explore` as one URL), so `createAppRouter` replaces it before the router starts.
- Revisit this decision if the binding is abandoned or the bundle cost proves too high for the Landing's first paint.
