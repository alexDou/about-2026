import { PANEL_IDS, PANEL_PATHS } from "./config";
import type { ResolvedPath, Route, RoutePath } from "./types";

/** The URL that shows `route`. */
export function pathOf(route: Route): RoutePath {
  if (route.screen === "landing") return "/";
  if (route.board.kind === "default") return "/explore";
  return PANEL_PATHS[route.board.panel];
}

/** Every state the site can be in. */
const ROUTES: readonly Route[] = [
  { screen: "landing" },
  { screen: "board", board: { kind: "default" } },
  ...PANEL_IDS.map((panel): Route => ({ screen: "board", board: { kind: "expanded", panel } })),
];

const ROUTE_BY_PATH: ReadonlyMap<string, Route> = new Map(
  ROUTES.map((route) => [pathOf(route), route]),
);

/**
 * The state a URL path shows. Trailing slashes are dropped and an unknown path shows the Landing;
 * either way the URL is not canonical and `replace` says to swap it for `path`.
 */
export function resolvePath(pathname: string): ResolvedPath {
  const trimmed = pathname.replace(/(?<=.)\/+$/, "");
  const route = ROUTE_BY_PATH.get(trimmed) ?? { screen: "landing" };
  const path = pathOf(route);
  return { route, path, replace: path !== pathname };
}
