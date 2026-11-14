import type { OctaneNode } from "octane";

export type BadgeFrameProps = {
  /** The accessible name of the image: the words on the badge. */
  text: string;
  /** The expressive line the browser shows on hover. */
  title: string;
  /** The badge's drawing, in a square of `BADGE_VIEW_BOX_SIZE`. */
  children?: OctaneNode;
};
