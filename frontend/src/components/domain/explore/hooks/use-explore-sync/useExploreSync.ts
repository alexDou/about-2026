import { useEffect } from "octane";
import type { ExploreState } from "../../../../../hooks/use-route";
import { go, prefersReducedMotion, reset } from "../../motion";

/**
 * Keeps Explore's motion in step with the route and with Explore leaving: the first route
 * starts Explore (its entrance), opening a Panel ends the entrance, and Explore's unmount
 * resets the motion. A signal cannot change while a component commits, so both are effects.
 */
export function useExploreSync(explore: ExploreState): void {
  useEffect(() => {
    go(explore, prefersReducedMotion());
  });

  useEffect(() => reset, []);
}
