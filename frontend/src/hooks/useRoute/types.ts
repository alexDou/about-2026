import type { PANEL_IDS, PANEL_PATHS } from "./config";

/** One of the Board's five Panels. */
export type PanelId = (typeof PANEL_IDS)[number];

/** The Board with no Panel open, or with one Expanded panel. */
export type BoardState =
  | { readonly kind: "default" }
  | { readonly kind: "expanded"; readonly panel: PanelId };

/** What the site shows: the Landing, or the Board in some state. */
export type Route =
  | { readonly screen: "landing" }
  | { readonly screen: "board"; readonly board: BoardState };

/** Every URL the site answers. Any other path is replaced by `/`. */
export type RoutePath = "/" | "/explore" | (typeof PANEL_PATHS)[PanelId];

/** A URL path read as a state. */
export type ResolvedPath = {
  readonly route: Route;
  /** The canonical URL of `route`. */
  readonly path: RoutePath;
  /** The requested path was not canonical: replace the URL with `path`, without a history entry. */
  readonly replace: boolean;
};

/** What the site shows now and how it got there. */
export type RouteState = {
  readonly route: Route;
  /** The canonical URL of `route`. */
  readonly path: RoutePath;
  /** A user action (a click) caused this change. False for the initial load and Back/Forward. */
  readonly userTriggered: boolean;
};

/** The current route, shared by everything that reads it, over the History API. */
export type RouteStore = {
  getSnapshot: () => RouteState;
  /** Listens for route changes. Returns the unsubscribe function. */
  subscribe: (listener: () => void) => () => void;
  /** Shows `route` as a new history entry, marked user-triggered. Does nothing if it is shown already. */
  navigate: (route: Route) => void;
};

/** What `link(route)` gives an `<a>`: its real URL, and a click handler for the app. */
export type RouteLink = {
  href: RoutePath;
  onClick: (event: MouseEvent) => void;
};

/** What `useRoute()` returns. */
export type UseRoute = {
  route: Route;
  userTriggered: boolean;
  navigate: (route: Route) => void;
  link: (route: Route) => RouteLink;
};
