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
   * Where the page says the switch belongs, when its content has made that clear: the switch walks
   * there if it is elsewhere, and reports nothing for that move. `undefined` leaves it where it is.
   */
  position?: boolean | undefined;
  /**
   * Called with the new position once the handle has arrived: when its walk ends, or its slide
   * under reduced motion. Only for a move the Visitor made by clicking: never on load, not on the click itself, and not
   * for a move that followed `position`.
   */
  onChange: (on: boolean) => void;
};
