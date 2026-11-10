import { Outlet, RouterContextProvider } from "@octanejs/tanstack-router";
import { createElement } from "octane";
import type { OctaneNode } from "octane";
import { PANEL_IDS } from "./config";
import { createAppRouter } from "./router";
import type { AppRouter } from "./router";
import type { AppRouterOptions, PanelId, RouteComponent } from "./types";

type Wrapper = (props: { children?: OctaneNode }) => OctaneNode;

const nothing: RouteComponent = () => null;

/**
 * A router for a test, at the address bar's URL: every component renders nothing (the shell just its
 * `Outlet`) unless `components` names one, and `pages` replaces the page of the Panels it lists.
 */
export function testRouter({
  pages,
  ...components
}: Partial<Omit<AppRouterOptions, "pages">> & {
  pages?: Partial<Record<PanelId, RouteComponent>>;
} = {}): AppRouter {
  const none = Object.fromEntries(PANEL_IDS.map((panel) => [panel, nothing])) as Record<
    PanelId,
    RouteComponent
  >;
  return createAppRouter({
    shell: Outlet,
    landing: nothing,
    board: nothing,
    ...components,
    pages: { ...none, ...pages },
  });
}

/**
 * A test `wrapper`: the router in context, for components that read or change the route. It does
 * not render the route tree. Pass a `router` that has loaded (`await router.load()`) for tests that
 * read the route; `inner` is another wrapper to nest inside (`intlWrapper()`).
 */
export function routerWrapper(inner?: Wrapper, router: AppRouter = testRouter()): Wrapper {
  return ({ children }) =>
    createElement(
      RouterContextProvider,
      { router },
      inner ? createElement(inner, null, children) : children,
    );
}
