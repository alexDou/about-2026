export type CountdownProps = {
  /** The whole seconds to count down from. Read once, when the countdown mounts. */
  from: number;
  /** The text for the seconds left: the countdown shows it as one text node and nothing else. */
  format: (seconds: number) => string;
  /** The countdown reached 0. Called once. */
  onDone: () => void;
};
