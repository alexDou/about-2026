import { useEffect, useEffectEvent, useLayoutEffect, useReducer } from "octane";
import { pathOf } from "../../../../../hooks/useRoute";
import type { BoardState } from "../../../../../hooks/useRoute";
import { isMobile, runningTransitions, scrollToTop } from "./probes";
import { initialSequence, sequenceReducer } from "./sequence";
import type { RefObject } from "../../types";
import type { BoardSequence, SequenceState } from "./types";

/** A stage is over once none of its transitions is left; a stage with none is over at once. */
function stageIsOver(state: SequenceState, root: Element | null): boolean {
  return state.running && !state.scrolling && runningTransitions(root) === 0;
}

/**
 * Plays the expand and collapse sequence for the Board state the route names. Every route change
 * plays it, whatever caused it. The stages are CSS transitions: a stage is on screen until the
 * transitions it started end (`transitionend`), then the next one starts. A route change in the
 * middle of a sequence drops the stages still to play and goes on from the stage on screen.
 * `busy` is true from the first stage to the end of the last.
 */
export function useBoardSequence(board: BoardState, root: RefObject<HTMLElement>): BoardSequence {
  const [state, dispatch] = useReducer(sequenceReducer, board, initialSequence);
  const path = pathOf(board);

  // The route changed. Before paint, so the first stage starts in the frame the route changes in.
  useLayoutEffect(() => {
    if (state.goal !== path) {
      dispatch({ type: "go", board, mobile: isMobile(), scrolled: window.scrollY > 0 });
    }
  }, [board, path, state.goal]);

  // A stage that runs no transition is over as soon as it is on screen.
  useLayoutEffect(() => {
    if (stageIsOver(state, root.current)) dispatch({ type: "done", step: state.step });
  }, [state, root]);

  const onTransitionEnd = useEffectEvent(() => {
    if (stageIsOver(state, root.current)) dispatch({ type: "done", step: state.step });
  });

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    element.addEventListener("transitionend", onTransitionEnd);
    element.addEventListener("transitioncancel", onTransitionEnd);
    return () => {
      element.removeEventListener("transitionend", onTransitionEnd);
      element.removeEventListener("transitioncancel", onTransitionEnd);
    };
  }, [root]);

  // Switching from a scrolled page: the first stage waits for the page to reach the top.
  useEffect(() => {
    if (!state.scrolling) return;
    const waiting = new AbortController();
    void scrollToTop(waiting.signal).then(() => {
      if (!waiting.signal.aborted) dispatch({ type: "scrolled", step: state.step });
    });
    return () => waiting.abort();
  }, [state.scrolling, state.step]);

  return { stage: state.stage, busy: state.running };
}
