import { MOBILE_QUERY, REDUCED_MOTION_QUERY, SEQUENCE_ATTRIBUTE, STILL_FRAMES } from "./config";

/** The window is the phone layout's. */
export function isMobile(): boolean {
  return window.matchMedia?.(MOBILE_QUERY).matches ?? false;
}

/**
 * How many CSS transitions of the slots and their views are still running under `root`. It reads
 * the browser's own animations, so a stage with no transition (reduced motion, or nothing that
 * changes size) counts zero and the sequence goes on without waiting for a `transitionend`.
 * Without the Web Animations API (jsdom) it counts zero.
 */
export function runningTransitions(root: Element | null): number {
  if (!root?.getAnimations) return 0;
  return root.getAnimations({ subtree: true }).filter((animation) => {
    const target = (animation.effect as KeyframeEffect | null)?.target;
    return (
      "transitionProperty" in animation &&
      animation.playState !== "finished" &&
      target?.hasAttribute(SEQUENCE_ATTRIBUTE)
    );
  }).length;
}

/**
 * Scrolls the page to the top, smoothly unless the visitor asks for no motion, and resolves when
 * it stops: at the top, or standing still for a few frames (an interrupted scroll, or one that
 * had nowhere to go). Resolves at once at the top. `signal` ends the wait early.
 */
export function scrollToTop(signal?: AbortSignal): Promise<void> {
  if (window.scrollY <= 0) return Promise.resolve();
  if (window.matchMedia?.(REDUCED_MOTION_QUERY).matches) {
    window.scrollTo({ top: 0, behavior: "instant" });
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let last = window.scrollY;
    let still = 0;
    const tick = () => {
      still = window.scrollY === last ? still + 1 : 0;
      last = window.scrollY;
      if (signal?.aborted || window.scrollY <= 0 || still >= STILL_FRAMES) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
