import { EXPLORE_KIND, EXPLORE_PATH, PANEL_IDS, PANEL_PATHS } from "./config";
import type { ExploreState, PanelId, RoutePath } from "./types";

/** The URL that shows `explore`. */
export function pathOf(explore: ExploreState): RoutePath {
  return explore.kind === EXPLORE_KIND.default ? EXPLORE_PATH : PANEL_PATHS[explore.panel];
}

/** Explore with no Panel open: where the Landing's logo leads. */
export const DEFAULT_EXPLORE: ExploreState = { kind: EXPLORE_KIND.default };

const EXPANDED_BY_PANEL = Object.fromEntries(
  PANEL_IDS.map((panel) => [panel, { kind: EXPLORE_KIND.expanded, panel }]),
) as Record<PanelId, ExploreState>;

/** Explore with `panel` as the Expanded panel. One object per Panel, so an Explore can be compared by identity. */
export function expandedExplore(panel: PanelId): ExploreState {
  return EXPANDED_BY_PANEL[panel];
}

/** Explore state `pathname` shows; `null` for a URL that shows no Explore (the Landing), or none. */
export function exploreAt(pathname: string | undefined): ExploreState | null {
  if (pathname === EXPLORE_PATH) return DEFAULT_EXPLORE;
  const panel = PANEL_IDS.find((id) => PANEL_PATHS[id] === pathname);
  return panel ? expandedExplore(panel) : null;
}
