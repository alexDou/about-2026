export type WalkingToggleProps = {
  /** What the switch turns on: its accessible name, and the hint shown on hover or focus. */
  label: string;
  /**
   * Called with the new position once the handle has arrived: when its walk ends, or its slide
   * under reduced motion. Never on load, and not on the click itself.
   */
  onChange: (on: boolean) => void;
};
