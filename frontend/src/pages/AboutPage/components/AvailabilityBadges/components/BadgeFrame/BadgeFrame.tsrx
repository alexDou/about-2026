import { VIEW_BOX_SIZE } from "../../config";
import styles from "./styles.module.css";
import type { BadgeFrameProps } from "./types";

const VIEW_BOX = `0 0 ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`;

/**
 * The SVG every badge is drawn in: an image named by the badge's text, whose `<title>` is the
 * expressive line the browser shows on hover.
 */
export function BadgeFrame({ text, title, children }: BadgeFrameProps) @{
  // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- an inline SVG has no `img` tag to use; role="img" is how it becomes one image.
  <svg class={styles["badge-frame"]} viewBox={VIEW_BOX} role="img" aria-label={text}>
    <title>{title}</title>
    {children}
  </svg>;
}
