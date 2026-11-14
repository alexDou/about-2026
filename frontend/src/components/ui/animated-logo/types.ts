export type RingWeave = {
  /** Waves around the O. */
  petals: number;
  /** Number of woven lines. */
  weave: number;
  /** Wave amplitude. */
  spread: number;
  /** Sideways sway of each wave. */
  wobble: number;
  /** Animation speed. */
  speed: number;
  /** Band width of the O, in source px. */
  thickness: number;
};

export type LineWeave = Omit<RingWeave, "petals"> & {
  /** Distance between waves along the line, in source px. */
  wavelength: number;
};

export type WeaveSettings = {
  ring: RingWeave;
  line: LineWeave;
};

export type AnimatedLogoProps = {
  /** Accessible name of the logo button. */
  label: string;
  onClick?: (event: MouseEvent) => void;
  /** Overrides the tuned weave settings. */
  settings?: WeaveSettings;
};
