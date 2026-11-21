import type { ICON_SIZES, ICON_TONES } from "./config";

export type IconSize = (typeof ICON_SIZES)[keyof typeof ICON_SIZES];

export type IconTone = (typeof ICON_TONES)[keyof typeof ICON_TONES];

export type IconProps = {
  /** The icon file's URL: an SVG on a 24×24 grid with `id="icon"` on its root. */
  media: string;
  /** Defaults to medium. */
  size?: IconSize;
  /** Defaults to the colour of the surrounding text. */
  tone?: IconTone;
  /** What the icon says, when it says something no text beside it does. Otherwise it is hidden. */
  label?: string;
};
