import type { OctaneNode } from "octane";
import type { BOARD_KIND, BOARD_PATH, PANEL_IDS, PANEL_PATHS } from "./config";

/** One of the Board's five Panels. */
export type PanelId = (typeof PANEL_IDS)[number];

/** The Board with no Panel open, or with one Expanded panel. */
export type BoardState =
  | { readonly kind: typeof BOARD_KIND.default }
  | { readonly kind: typeof BOARD_KIND.expanded; readonly panel: PanelId };

/** A URL a link or `navigate` leads to: the Board with no Panel open, or an Expanded panel. */
export type RoutePath = typeof BOARD_PATH | (typeof PANEL_PATHS)[PanelId];

/** What `link(board)` gives an `<a>`: its real URL, and a click handler for the app. */
export type RouteLink = {
  href: RoutePath;
  onClick: (event: MouseEvent) => void;
};

/** What `useRoute()` returns. */
export type UseRoute = {
  /** What the Board shows: no Panel open, or the Expanded panel the URL names. The default Board when the URL shows no Board (the Landing). */
  board: BoardState;
  navigate: (board: BoardState) => void;
  link: (board: BoardState) => RouteLink;
};

/** A component the router renders for a route. */
export type RouteComponent = () => OctaneNode;

/** What `createAppRouter` takes: every component the routes render. */
export type AppRouterOptions = {
  /** The root route's component: it renders the whole site, with an `Outlet` for the screen. */
  shell: RouteComponent;
  /** The Landing. */
  landing: RouteComponent;
  /** The Board: its `Outlet` shows the Expanded panel's page. */
  board: RouteComponent;
  /** The page of each Panel, shown in the Board's `Outlet` while that Panel is Expanded. */
  pages: Record<PanelId, RouteComponent>;
};

declare module "@tanstack/router-core" {
  /** The Panel a route opens: how the Board knows which one is Expanded. */
  interface StaticDataRouteOption {
    panel?: PanelId;
  }
}
