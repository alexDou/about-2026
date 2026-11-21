import { ICON_ID, ICON_SIZES, ICON_TONES, ICON_VIEW_BOX } from "./config";
import styles from "./styles.module.css";
import type { IconProps } from "./types";

/**
 * One icon, drawn from its SVG file through `<use>` (as the Portrait draws its brush), so it takes
 * its colour from CSS and an `<img>` could not. Size and tone are props; every icon on the site
 * goes through here.
 */
export function Icon({
  media,
  size = ICON_SIZES.medium,
  tone = ICON_TONES.inherit,
  label,
}: IconProps) @{
  <svg
    class={[styles["icon"], styles[`icon--${size}`], styles[`icon--${tone}`]]}
    viewBox={ICON_VIEW_BOX}
    role={label ? "img" : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : "true"}
  >
    <use href={`${media}#${ICON_ID}`} />
  </svg>;
}
