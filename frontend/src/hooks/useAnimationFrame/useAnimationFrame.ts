import { useEffect, useEffectEvent } from "octane";
import type { AnimationFrameOptions, FrameCallback } from "./types";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Runs `callback` on a throttled requestAnimationFrame loop.
 * Pauses while the tab is hidden and whenever the user prefers reduced motion.
 */
export function useAnimationFrame(
  callback: FrameCallback,
  { minIntervalMs = 32, maxDeltaMs = 80 }: AnimationFrameOptions = {},
): void {
  const onFrame = useEffectEvent(callback);

  useEffect(() => {
    const reduced = window.matchMedia?.(REDUCED_MOTION);
    let frame = 0;
    let last: number | undefined;
    let elapsed = 0;

    const tick = (time: number) => {
      if (last === undefined || time - last >= minIntervalMs) {
        const delta = last === undefined ? 0 : Math.min(time - last, maxDeltaMs);
        last = time;
        elapsed += delta / 1000;
        onFrame(elapsed, delta / 1000);
      }
      frame = requestAnimationFrame(tick);
    };

    const sync = () => {
      cancelAnimationFrame(frame);
      last = undefined;
      if (!document.hidden && !reduced?.matches) frame = requestAnimationFrame(tick);
    };

    sync();
    document.addEventListener("visibilitychange", sync);
    reduced?.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", sync);
      reduced?.removeEventListener("change", sync);
    };
  }, [minIntervalMs, maxDeltaMs]);
}
