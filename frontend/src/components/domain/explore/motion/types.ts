import type { PanelId } from "../../../../hooks/use-route";

/** What Explore knows about its own motion: the entrance and the scroll before a switch. */
export type ExploreMotionState = {
  /** Explore has shown its first route. */
  readonly started: boolean;
  /** The page is scrolling to the top before a switch: the route has not changed yet. */
  readonly scrolling: boolean;
  /** The Panels whose title has not faded in yet: Explore's entrance plays while any is left. */
  readonly titles: readonly PanelId[];
};
