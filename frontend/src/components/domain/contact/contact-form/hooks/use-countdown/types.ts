export type Countdown = {
  /** Whole seconds left; 0 when it is not running. */
  remaining: number;
  start: (seconds: number) => void;
};
