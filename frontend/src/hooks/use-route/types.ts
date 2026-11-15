import type { OctaneNode } from "octane";
import type { ViewTransitionOptions } from "@tanstack/router-core";
import type { EXPLORE_KIND, EXPLORE_PATH, PANEL_IDS, PANEL_PATHS } from "./config";

/** One of Explore's five Panels. */
export type PanelId = (typeof PANEL_IDS)[number];

/** Explore with no Panel open, or with one Expanded panel. */
export type ExploreState =
  | { readonly kind: typeof EXPLORE_KIND.default }
  | { readonly kind: typeof EXPLORE_KIND.expanded; readonly panel: PanelId };

/** A URL a link or `navigate` leads to: Explore with no Panel open, or an Expanded panel. */
export type RoutePath = typeof EXPLORE_PATH | (typeof PANEL_PATHS)[PanelId];

/** What `link(explore)` gives an `<a>`: its real URL, and a click handler for the app. */
export type RouteLink = {
  href: RoutePath;
  onClick: (event: MouseEvent) => void;
};

/** What `useRoute()` returns. */
export type UseRoute = {
  /** What Explore shows: no Panel open, or the Expanded panel the URL names. The default Explore when the URL shows no Explore (the Landing). */
  explore: ExploreState;
  navigate: (explore: ExploreState) => void;
  link: (explore: ExploreState) => RouteLink;
};

/** A component the router renders for a route. */
export type RouteComponent = () => OctaneNode;

/** What `createAppRouter` takes: every component the routes render. */
export type AppRouterOptions = {
  /** The root route's component: it renders the whole site, with an `Outlet` for the screen. */
  shell: RouteComponent;
  /** The Landing. */
  landing: RouteComponent;
  /** Explore: its `Outlet` shows the Expanded panel's page. */
  explore: RouteComponent;
  /** The page of each Panel, shown in Explore's `Outlet` while that Panel is Expanded. */
  pages: Record<PanelId, RouteComponent>;
  /**
   * The View Transition every navigation starts, with the types it
   * gets from where it leads (`false`: none). None when left out.
   */
  viewTransition?: ExploreViewTransition;
};

/** A navigation's View Transition: its types, from the URL it leaves and the one it reaches. */
export type ExploreViewTransition = ViewTransitionOptions;

declare module "@tanstack/router-core" {
  /** The Panel a route opens: how Explore knows which one is Expanded. */
  interface StaticDataRouteOption {
    panel?: PanelId;
  }
}
