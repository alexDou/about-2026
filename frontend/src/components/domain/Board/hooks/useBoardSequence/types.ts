import type { BoardState, RoutePath } from "../../../../../hooks/useRoute";
import type { BoardStage } from "../../types";

/** Where a sequence stands: the stage on screen and the stages still to play. */
export type SequenceState = {
  /** The URL of the route the sequence plays towards. */
  readonly goal: RoutePath;
  readonly stage: BoardStage;
  /** The stages after `stage`, in order. */
  readonly queue: readonly BoardStage[];
  /** A stage is playing, or the scroll that comes before the first one. */
  readonly running: boolean;
  /** The page is scrolling to the top; no stage has started yet. */
  readonly scrolling: boolean;
  /** Counts every stage and scroll started, so a late `done` or `scrolled` is told from the current one. */
  readonly step: number;
};

export type SequenceEvent =
  /** The route changed: play whatever leads from the stage on screen to `board`. */
  | { type: "go"; board: BoardState; mobile: boolean; scrolled: boolean }
  /** The scroll to the top ended. */
  | { type: "scrolled"; step: number }
  /** The transitions of the stage on screen ended. */
  | { type: "done"; step: number };

/** What `useBoardSequence` gives the Board. */
export type BoardSequence = {
  /** What to show now. */
  stage: BoardStage;
  /** A sequence is running: clicks are ignored. */
  busy: boolean;
};
