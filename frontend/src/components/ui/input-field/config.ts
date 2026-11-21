/** Where the label stands: above its input, or beside it (it moves above on a narrow screen). */
export const INPUT_FIELD_LAYOUTS = {
  stacked: "stacked",
  inline: "inline",
} as const;

/** The input's fill: a light one for a light surface, a dark one for the Panel's colour. */
export const INPUT_FIELD_TONES = {
  light: "light",
  dark: "dark",
} as const;
