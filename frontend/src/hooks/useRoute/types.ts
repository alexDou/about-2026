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
