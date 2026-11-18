/** What a click does in each position, read by the page from its messages. */
export type WalkingToggleLabels = {
  /** Shown while off: what turning it on does ("Expand all"). */
  off: string;
  /** Shown while on: what turning it off does ("Collapse all"). */
  on: string;
};

export type WalkingToggleProps = {
  /** Its accessible name and its hint, for the position it is in. */
  labels: WalkingToggleLabels;
  /**
   * Called with the new position once the handle has arrived: when its walk ends, or its slide
   * under reduced motion. Never on load, and not on the click itself.
   */
  onChange: (on: boolean) => void;
};
