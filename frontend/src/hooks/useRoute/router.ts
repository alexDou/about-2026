import {
  createBrowserHistory,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@octanejs/tanstack-router";
import type { RouterHistory } from "@octanejs/tanstack-router";
import { BOARD_PATH, LANDING_PATH, PANEL_IDS, PANEL_PATHS } from "./config";
import type { AppRouterOptions } from "./types";

/**
 * Replaces a URL that ends in a slash by the one without, with no history entry. The router
 * matches both alike and would leave the address bar as it is.
 */
function dropTrailingSlash(history: RouterHistory) {
  const { pathname, search, hash } = history.location;
  const trimmed = pathname.replace(/(?<=.)\/+$/, "");
  if (trimmed !== pathname) history.replace(trimmed + search + hash);
}

/**
 * The site's router. The routes are the site's states: the Landing, and the Board with a page
 * route under it for each Panel. Any other path is replaced by `/` without a history entry, and
 * so is a trailing slash. The components come in as options, so this module imports none.
 */
export function createAppRouter({ shell, landing, board, pages }: AppRouterOptions) {
  // Every Board state starts at the top, so the browser must not restore a scroll position on a
  // reload or Back/Forward. Set when the router is made, because an effect would come too late.
  window.history.scrollRestoration = "manual";
  const history = createBrowserHistory();
  dropTrailingSlash(history);

  const root = createRootRoute({ component: shell });
  const landingRoute = createRoute({
    getParentRoute: () => root,
    path: LANDING_PATH,
    component: landing,
  });
  const boardRoute = createRoute({ getParentRoute: () => root, id: "board", component: board });
  const defaultBoardRoute = createRoute({ getParentRoute: () => boardRoute, path: BOARD_PATH });
  const panelRoutes = PANEL_IDS.map((panel) =>
    createRoute({
      getParentRoute: () => boardRoute,
      path: PANEL_PATHS[panel],
      component: pages[panel],
      staticData: { panel },
    }),
  );
  const unknownRoute = createRoute({
    getParentRoute: () => root,
    path: "$",
    beforeLoad: () => {
      throw redirect({ to: LANDING_PATH, replace: true });
    },
  });

  return createRouter({
    routeTree: root.addChildren([
      landingRoute,
      boardRoute.addChildren([defaultBoardRoute, ...panelRoutes]),
      unknownRoute,
    ]),
    history,
    caseSensitive: true,
    scrollRestoration: false,
  });
}

/** The site's router. */
export type AppRouter = ReturnType<typeof createAppRouter>;
