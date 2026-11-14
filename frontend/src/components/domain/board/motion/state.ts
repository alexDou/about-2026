import { BOARD_KIND, PANEL_IDS } from "../../../../hooks/use-route";
import type { BoardState, PanelId } from "../../../../hooks/use-route";
import type { BoardMotionState } from "./types";

/**
 * The Board's motion before the Board mounts and after it unmounts: its entrance is still to
 * play. The first route starts it.
 */
export const NOT_STARTED: BoardMotionState = {
  started: false,
  scrolling: false,
  titles: PANEL_IDS,
};

/** The state of a Board that starts on `board`, its entrance still to play unless `reducedMotion`. */
export function initialState(board: BoardState, reducedMotion: boolean): BoardMotionState {
  return {
    started: true,
    scrolling: false,
    // Only the default Board has an entrance: a Board that starts Expanded has none to play.
    titles: reducedMotion || board.kind === BOARD_KIND.expanded ? [] : PANEL_IDS,
  };
}

/**
 * The route changed (the browser's View Transition plays the change itself). The first route
 * starts the Board. Opening a Panel ends the entrance, so the Panels that come back on close do
 * not replay it. Returns `state` itself where nothing changes.
 */
export function routeChanged(
  state: BoardMotionState,
  board: BoardState,
  reducedMotion: boolean,
): BoardMotionState {
  if (!state.started) return initialState(board, reducedMotion);
  if (board.kind !== BOARD_KIND.expanded || state.titles.length === 0) return state;
  return { ...state, titles: [] };
}

/**
 * The page scrolls up (`on`) before a switch from a scrolled page, or has. The route changes when
 * it has: the page never closes out of sight, and the browser has nothing to clamp.
 */
export function scrollingUp(state: BoardMotionState, on: boolean): BoardMotionState {
  return state.scrolling === on ? state : { ...state, scrolling: on };
}

/** The title of `panel` ended its fade-in of the entrance. Returns `state` where none waits for it. */
export function titleFaded(state: BoardMotionState, panel: PanelId): BoardMotionState {
  if (!state.titles.includes(panel)) return state;
  return { ...state, titles: state.titles.filter((title) => title !== panel) };
}

/** The Board is playing its entrance or scrolling up before a switch: its clicks are ignored. */
export function isBusy(state: BoardMotionState): boolean {
  return state.scrolling || state.titles.length > 0;
}
