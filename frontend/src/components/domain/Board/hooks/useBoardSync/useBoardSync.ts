import { useEffect } from "octane";
import type { BoardState } from "../../../../../hooks/useRoute";
import { go, prefersReducedMotion, reset } from "../../motion";

/**
 * Keeps the Board's motion in step with the route and with the Board leaving: the first route
 * starts the Board (its entrance), opening a Panel ends the entrance, and the Board's unmount
 * resets the motion. A signal cannot change while a component commits, so both are effects.
 */
export function useBoardSync(board: BoardState): void {
  useEffect(() => {
    go(board, prefersReducedMotion());
  });

  useEffect(() => reset, []);
}
