import { useEffect } from "octane";
import { usePrevious } from "../usePrevious";

/**
 * Starts every Board state at the top of the page: `state` changing scrolls to the top. (Browser
 * scroll restoration is off site-wide, see the route store.)
 */
export function useScrollReset(state: string): void {
  const before = usePrevious(state);

  // Listed deps, on purpose: left out, the effect would scroll to the top on every render.
  useEffect(() => {
    if (before !== undefined) window.scrollTo(0, 0);
  }, [state, before]);
}
