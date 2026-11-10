import { createScope } from "octane/signals";
import {
  NOT_STARTED,
  isBusy,
  routeChanged,
  scrollingUp,
  titleFaded,
  transitionEnded,
} from "./sequence";
import type { BoardState, PanelId } from "../../../../hooks/useRoute";
import type { BoardMotionState, Surroundings } from "./types";

/**
 * The Board's motion, shared by its components: there is one Board in the document. The state is
 * a value in one signal; the rules for changing it are in `sequence.ts`.
 */
const scope = createScope({ scopeKey: "board-motion" });
const state$ = scope.signal$<BoardMotionState>("state", NOT_STARTED);

/** What the Board shows while it is on its way; `null` before it starts, when the route decides. */
export const stage$ = scope.derived$("stage", () => state$.get().stage);
/** The entrance or a sequence is playing: the Board ignores clicks. */
export const busy$ = scope.derived$("busy", () => isBusy(state$.get()));
/** The Board's entrance is playing. */
export const entering$ = scope.derived$("entering", () => state$.get().titles.length > 0);
/** The route changed: play whatever leads from the stage on screen to `board`. */
export const go = (board: BoardState, around: Surroundings) =>
  state$.set((state) => routeChanged(state, board, around));
/** The slot of `panel` ended its resize. */
export const slotResized = (panel: PanelId) =>
  state$.set((state) => transitionEnded(state, "slots", panel));
/** The view of `panel` ended its fade. */
export const viewFaded = (panel: PanelId) =>
  state$.set((state) => transitionEnded(state, "views", panel));
/** The page starts scrolling up before a switch: the Board ignores clicks until it has. */
export const scrollStarted = () => state$.set((state) => scrollingUp(state, true));
/** The page has scrolled up. */
export const scrollEnded = () => state$.set((state) => scrollingUp(state, false));
/** The title of `panel` ended its fade-in of the entrance. */
export const titleShown = (panel: PanelId) => state$.set((state) => titleFaded(state, panel));
/** The Board is gone: the next one starts from scratch. */
export const reset = () => state$.set(NOT_STARTED);
