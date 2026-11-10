import { MOBILE_QUERY, REDUCED_MOTION_QUERY, STILL_FRAMES } from "./config";

/** The window is the phone layout's. */
export function isMobile(): boolean {
  return window.matchMedia?.(MOBILE_QUERY).matches ?? false;
}

/** The visitor asks for no motion. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia?.(REDUCED_MOTION_QUERY).matches ?? false;
}

/**
 * Scrolls the page to the top, smoothly unless the visitor asks for no motion, and resolves when
 * it stops: at the top, or standing still for a few frames (an interrupted scroll, or one that
 * had nowhere to go). Resolves at once at the top. `signal` ends the wait early.
 */
export function scrollToTop(signal?: AbortSignal): Promise<void> {
  if (window.scrollY <= 0) return Promise.resolve();
  if (prefersReducedMotion()) {
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
