import { pathOf } from "../../../../../hooks/useRoute";
import type { BoardState } from "../../../../../hooks/useRoute";
import type { BoardStage } from "../../types";
import type { SequenceEvent, SequenceState } from "./types";

const DEFAULT_STAGE: BoardStage = { layout: null, views: "panels" };
const EVEN_STAGE: BoardStage = { layout: null, views: "none" };

/** The stage a route rests at: the Panels for the default Board, the Stripes and the page otherwise. */
export function settledStage(board: BoardState): BoardStage {
  return board.kind === "expanded" ? { layout: board.panel, views: "expanded" } : DEFAULT_STAGE;
}

/**
 * The stages from `stage` back to the default Board, each one step on the way: the page and the
 * Stripes fade out, the slots take their even sizes, the Panels fade in. The stages of every
 * Expanded panel meet at the even slots, which makes the stages a tree.
 */
function stagesToDefault(stage: BoardStage): BoardStage[] {
  if (stage.layout === null) {
    return stage.views === "panels" ? [stage] : [stage, DEFAULT_STAGE];
  }
  const resized: BoardStage = { layout: stage.layout, views: "none" };
  const rest: BoardStage[] = [resized, EVEN_STAGE, DEFAULT_STAGE];
  return stage.views === "expanded" ? [stage, ...rest] : rest;
}

const sameStage = (a: BoardStage, b: BoardStage) => a.layout === b.layout && a.views === b.views;

/**
 * The stages to play to get from `from` to `to`, `from` not included. Desktop walks the tree of
 * stages (opening is closing backwards; switching closes, then opens, without the Panels fading in
 * only to fade out again); mobile has no fade-out and no closing step, so it plays `to` at once.
 */
export function planStages(from: BoardStage, to: BoardStage, mobile: boolean): BoardStage[] {
  if (sameStage(from, to)) return [];
  if (mobile) return [to];

  const up = stagesToDefault(from);
  const down = stagesToDefault(to);
  // Both chains end at the default Board, so they meet at the latest there.
  const upToMeeting = up.findIndex((stage) => down.some((other) => sameStage(stage, other)));
  const meeting = up[upToMeeting] ?? DEFAULT_STAGE;
  const downToMeeting = down.findIndex((stage) => sameStage(stage, meeting));
  return [...up.slice(1, upToMeeting + 1), ...down.slice(0, downToMeeting).toReversed()];
}

/** A sequence at rest on the stage of the first route. */
export function initialSequence(board: BoardState): SequenceState {
  return {
    goal: pathOf(board),
    stage: settledStage(board),
    queue: [],
    running: false,
    scrolling: false,
    step: 0,
  };
}

/** Starts the first queued stage, or rests when none is left. */
function advance(state: SequenceState): SequenceState {
  const [stage, ...queue] = state.queue;
  if (!stage) return { ...state, running: false, scrolling: false };
  return { ...state, stage, queue, running: true, scrolling: false, step: state.step + 1 };
}

export function sequenceReducer(state: SequenceState, event: SequenceEvent): SequenceState {
  switch (event.type) {
    case "go": {
      const to = settledStage(event.board);
      const queue = planStages(state.stage, to, event.mobile);
      const step = state.step + 1;
      const goal = pathOf(event.board);
      if (queue.length === 0) {
        return { ...state, goal, queue, running: false, scrolling: false, step };
      }
      // Switching from a scrolled page: scroll up first, so the page never closes out of sight.
      const switching = state.stage.views === "expanded" && to.views === "expanded";
      if (switching && event.scrolled) {
        return { ...state, goal, queue, running: true, scrolling: true, step };
      }
      return advance({ ...state, goal, queue, step });
    }
    case "scrolled":
      return state.scrolling && event.step === state.step ? advance(state) : state;
    case "done":
      return state.running && !state.scrolling && event.step === state.step
        ? advance(state)
        : state;
  }
}
