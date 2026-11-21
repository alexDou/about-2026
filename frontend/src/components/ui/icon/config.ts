/** How big an icon draws: its side. */
export const ICON_SIZES = {
  small: "small",
  medium: "medium",
  large: "large",
} as const;

/** Where an icon takes its colour from: the text around it, or a fixed one. */
export const ICON_TONES = {
  inherit: "inherit",
  light: "light",
  dark: "dark",
} as const;

/** Every icon file is drawn on a 24×24 grid, with `id="icon"` on its root element. */
export const ICON_VIEW_BOX = "0 0 24 24";
export const ICON_ID = "icon";
