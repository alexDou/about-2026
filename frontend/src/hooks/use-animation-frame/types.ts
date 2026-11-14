/**
 * Called once per frame. `elapsedSeconds` is the total running time (time spent paused,
 * hidden or under reduced motion doesn't count); `deltaSeconds` is the time since the previous frame.
 */
export type FrameCallback = (elapsedSeconds: number, deltaSeconds: number) => void;

export type AnimationFrameOptions = {
  /** Minimum milliseconds between callbacks (throttle). Defaults to 32 (~30 fps). */
  minIntervalMs?: number;
  /** Largest delta passed to the callback, so a stalled tab doesn't jump. Defaults to 80 ms. */
  maxDeltaMs?: number;
};
