import { BOARD_KIND, PANEL_IDS } from "../../../../hooks/useRoute";
import type { BoardState, PanelId } from "../../../../hooks/useRoute";
import { STAGE_VIEWS } from "../config";
import type { BoardStage } from "../types";
import type { Awaiting, BoardMotionState, Surroundings } from "./types";

const DEFAULT_STAGE: BoardStage = { layout: null, views: STAGE_VIEWS.panels };
const EVEN_STAGE: BoardStage = { layout: null, views: STAGE_VIEWS.none };

/** Nothing left to wait for. */
export const NOTHING_AWAITED: Awaiting = { slots: [], views: [] };

/** The stage a route rests at: the Panels for the default Board, the Stripes and the page otherwise. */
export function settledStage(board: BoardState): BoardStage {
  return board.kind === BOARD_KIND.expanded
    ? { layout: board.panel, views: STAGE_VIEWS.expanded }
    : DEFAULT_STAGE;
}

/**
 * The stages from `stage` back to the default Board, each one step on the way: the page and the
 * Stripes fade out, the slots take their even sizes, the Panels fade in. The stages of every
 * Expanded panel meet at the even slots, which makes the stages a tree.
 */
function stagesToDefault(stage: BoardStage): BoardStage[] {
  if (stage.layout === null) {
    return stage.views === STAGE_VIEWS.panels ? [stage] : [stage, DEFAULT_STAGE];
  }
  const resized: BoardStage = { layout: stage.layout, views: STAGE_VIEWS.none };
  const rest: BoardStage[] = [resized, EVEN_STAGE, DEFAULT_STAGE];
  return stage.views === STAGE_VIEWS.expanded ? [stage, ...rest] : rest;
}

const sameStage = (a: BoardStage, b: BoardStage) => a.layout === b.layout && a.views === b.views;

/**
 * The stages to play to get from `from` to `to`, `from` not included. Desktop walks the tree of
 * stages (opening is closing backwards). Switching from one Expanded panel to another, and all of
 * mobile, has nothing to fade out and no closing step: `to` plays at once and only the sizes
 * animate.
 */
export function planStages(from: BoardStage, to: BoardStage, mobile: boolean): BoardStage[] {
  if (sameStage(from, to)) return [];
  const switching = from.views === STAGE_VIEWS.expanded && to.views === STAGE_VIEWS.expanded;
  if (mobile || switching) return [to];

  const up = stagesToDefault(from);
  const down = stagesToDefault(to);
  // Both chains end at the default Board, so they meet at the latest there.
  const upToMeeting = up.findIndex((stage) => down.some((other) => sameStage(stage, other)));
  const meeting = up[upToMeeting] ?? DEFAULT_STAGE;
  const downToMeeting = down.findIndex((stage) => sameStage(stage, meeting));
  return [...up.slice(1, upToMeeting + 1), ...down.slice(0, downToMeeting).toReversed()];
}

/** A slot fills its share of the Board, or is a Stripe: even and Expanded slots grow alike. */
const fills = (stage: BoardStage, panel: (typeof PANEL_IDS)[number]) =>
  stage.layout === null || stage.layout === panel;

const showsViews = (stage: BoardStage) => stage.views !== STAGE_VIEWS.none;

/**
 * The transitions that play when the Board goes from `from` to `to`: a slot runs one when it turns
 * into a Stripe or back, the views run one when they fade out or in.
 */
export function awaitedBy(from: BoardStage, to: BoardStage): Awaiting {
  return {
    slots: PANEL_IDS.filter((panel) => fills(from, panel) !== fills(to, panel)),
    views: showsViews(from) !== showsViews(to) ? PANEL_IDS : [],
  };
}

const isNothing = (awaiting: Awaiting) => awaiting.slots.length + awaiting.views.length === 0;

/**
 * The Board's motion before the Board mounts and after it unmounts. The route decides what the
 * Board shows until the first route change starts it, so a visit to any URL shows its stage at
 * once. Its entrance is still to play.
 */
export const NOT_STARTED: BoardMotionState = {
  stage: null,
  queue: [],
  awaiting: NOTHING_AWAITED,
  scrolling: false,
  titles: PANEL_IDS,
};

/** The state of a Board at rest on the stage of `board`, its entrance still to play unless `reducedMotion`. */
export function initialState(board: BoardState, reducedMotion: boolean): BoardMotionState {
  const stage = settledStage(board);
  return {
    stage,
    queue: [],
    awaiting: NOTHING_AWAITED,
    scrolling: false,
    // Opening a Panel ends the entrance, so a Board that starts Expanded has none to play.
    titles: reducedMotion || stage.layout !== null ? [] : PANEL_IDS,
  };
}

/**
 * Starts the first queued stage that has a transition to wait for, skipping those that have none,
 * or rests on the last one when none is left.
 */
function advance(stage: BoardStage, queue: readonly BoardStage[]): Partial<BoardMotionState> {
  let current = stage;
  for (const [index, next] of queue.entries()) {
    const awaiting = awaitedBy(current, next);
    current = next;
    if (!isNothing(awaiting)) {
      return { stage: next, queue: queue.slice(index + 1), awaiting };
    }
  }
  return { stage: current, queue: [], awaiting: NOTHING_AWAITED };
}

/**
 * The route changed. A Board that has not started starts at rest on the route's stage. Returns
 * `state` itself where the route's stage is the one the Board already plays towards, the last of
 * the queue.
 */
export function routeChanged(
  state: BoardMotionState,
  board: BoardState,
  { mobile, reducedMotion }: Surroundings,
): BoardMotionState {
  const { stage } = state;
  if (stage === null) return initialState(board, reducedMotion);

  const to = settledStage(board);
  if (sameStage(state.queue.at(-1) ?? stage, to)) return state;

  const next = {
    ...state,
    // Opening a Panel ends the entrance, so the Panels that come back on close do not replay it.
    titles: to.layout !== null ? [] : state.titles,
  };
  if (reducedMotion) return { ...next, ...advance(to, []) };

  return { ...next, ...advance(stage, planStages(stage, to, mobile)) };
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

/** A transition of the stage on screen ended. The next stage starts once none is left. */
export function transitionEnded(
  state: BoardMotionState,
  kind: keyof Awaiting,
  panel: (typeof PANEL_IDS)[number],
): BoardMotionState {
  const { stage } = state;
  if (stage === null || !state.awaiting[kind].includes(panel)) return state;
  const awaiting = { ...state.awaiting, [kind]: state.awaiting[kind].filter((id) => id !== panel) };
  if (!isNothing(awaiting)) return { ...state, awaiting };
  return { ...state, ...advance(stage, state.queue) };
}

/** The Board is playing its entrance or a sequence (the scroll before a switch included): its clicks are ignored. */
export function isBusy(state: BoardMotionState): boolean {
  return state.scrolling || !isNothing(state.awaiting) || state.titles.length > 0;
}
