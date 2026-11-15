import { EXPLORE_KIND, PANEL_IDS } from "../../../../hooks/use-route";
import type { ExploreState, PanelId } from "../../../../hooks/use-route";
import type { ExploreMotionState } from "./types";

/**
 * Explore's motion before Explore mounts and after it unmounts: its entrance is still to
 * play. The first route starts it.
 */
export const NOT_STARTED: ExploreMotionState = {
  started: false,
  scrolling: false,
  titles: PANEL_IDS,
};

/** The state of an Explore that starts on `explore`, its entrance still to play unless `reducedMotion`. */
export function initialState(explore: ExploreState, reducedMotion: boolean): ExploreMotionState {
  return {
    started: true,
    scrolling: false,
    // Only the default Explore has an entrance: an Explore that starts Expanded has none to play.
    titles: reducedMotion || explore.kind === EXPLORE_KIND.expanded ? [] : PANEL_IDS,
  };
}

/**
 * The route changed (the browser's View Transition plays the change itself). The first route
 * starts Explore. Opening a Panel ends the entrance, so the Panels that come back on close do
 * not replay it. Returns `state` itself where nothing changes.
 */
export function routeChanged(
  state: ExploreMotionState,
  explore: ExploreState,
  reducedMotion: boolean,
): ExploreMotionState {
  if (!state.started) return initialState(explore, reducedMotion);
  if (explore.kind !== EXPLORE_KIND.expanded || state.titles.length === 0) return state;
  return { ...state, titles: [] };
}

/**
 * The page scrolls up (`on`) before a switch from a scrolled page, or has. The route changes when
 * it has: the page never closes out of sight, and the browser has nothing to clamp.
 */
export function scrollingUp(state: ExploreMotionState, on: boolean): ExploreMotionState {
  return state.scrolling === on ? state : { ...state, scrolling: on };
}

/** The title of `panel` ended its fade-in of the entrance. Returns `state` where none waits for it. */
export function titleFaded(state: ExploreMotionState, panel: PanelId): ExploreMotionState {
  if (!state.titles.includes(panel)) return state;
  return { ...state, titles: state.titles.filter((title) => title !== panel) };
}

/** Explore is playing its entrance or scrolling up before a switch: its clicks are ignored. */
export function isBusy(state: ExploreMotionState): boolean {
  return state.scrolling || state.titles.length > 0;
}
