import type { PanelId } from "../../../../hooks/useRoute";
import type { BoardStage } from "../types";

/**
 * The transitions of the stage on screen that have not ended yet, by the Panel whose slot or view
 * runs them. A stage is over when none is left.
 */
export type Awaiting = {
  /** Slots that change size. */
  readonly slots: readonly PanelId[];
  /** Views that fade out or in. */
  readonly views: readonly PanelId[];
};

/** What the browser says when the route changes. */
export type Surroundings = {
  /** The window is the phone layout's. */
  mobile: boolean;
  /** The visitor asks for no motion: every stage is skipped. */
  reducedMotion: boolean;
};

/** What the Board knows about its own motion: the sequence of stages and the entrance. */
export type BoardMotionState = {
  /**
   * What the Board shows, from its first route change on; `null` before, when the route decides.
   * The stage the sequence plays towards is where the queue ends.
   */
  readonly stage: BoardStage | null;
  /** The stages after `stage`, in order. */
  readonly queue: readonly BoardStage[];
  readonly awaiting: Awaiting;
  /** The page is scrolling to the top before a switch: the route has not changed yet. */
  readonly scrolling: boolean;
  /** The Panels whose title has not faded in yet: the Board's entrance plays while any is left. */
  readonly titles: readonly PanelId[];
};
