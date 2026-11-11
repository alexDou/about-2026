import { createScope } from "octane/signals";
import { NOT_STARTED, isBusy, routeChanged, scrollingUp, titleFaded } from "./state";
import type { BoardState, PanelId } from "../../../../hooks/useRoute";
import type { BoardMotionState } from "./types";

/**
 * The Board's motion, shared by its components: there is one Board in the document. The state is
 * a value in one signal; the rules for changing it are in `state.ts`. A change of route is played
 * by the browser as a View Transition (the Slot's stylesheet), so none of it is kept here.
 */
const scope = createScope({ scopeKey: "board-motion" });
const state$ = scope.signal$<BoardMotionState>("state", NOT_STARTED);

/** The entrance is playing or the page scrolls up: the Board ignores clicks. */
export const busy$ = scope.derived$("busy", () => isBusy(state$.get()));
/** The Board's entrance is playing. */
export const entering$ = scope.derived$("entering", () => state$.get().titles.length > 0);
/** The route changed to `board`; the first one starts the Board. */
export const go = (board: BoardState, reducedMotion: boolean) =>
  state$.set((state) => routeChanged(state, board, reducedMotion));
/** The page starts scrolling up before a switch: the Board ignores clicks until it has. */
export const scrollStarted = () => state$.set((state) => scrollingUp(state, true));
/** The page has scrolled up. */
export const scrollEnded = () => state$.set((state) => scrollingUp(state, false));
/** The title of `panel` ended its fade-in of the entrance. */
export const titleShown = (panel: PanelId) => state$.set((state) => titleFaded(state, panel));
/** The Board is gone: the next one starts from scratch. */
export const reset = () => state$.set(NOT_STARTED);
