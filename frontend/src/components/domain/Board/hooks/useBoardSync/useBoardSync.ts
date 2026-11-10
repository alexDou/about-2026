import { useEffect } from "octane";
import type { BoardState } from "../../../../../hooks/useRoute";
import { go, isMobile, prefersReducedMotion, reset } from "../../motion";

/**
 * Keeps the Board's motion in step with the route and with the Board leaving: a change of route
 * starts a sequence (the first one starts the Board), and the Board's unmount resets the motion.
 * A signal cannot change while a component commits, so both are effects.
 */
export function useBoardSync(board: BoardState): void {
  useEffect(() => {
    go(board, { mobile: isMobile(), reducedMotion: prefersReducedMotion() });
  });

  useEffect(() => reset, []);
}
