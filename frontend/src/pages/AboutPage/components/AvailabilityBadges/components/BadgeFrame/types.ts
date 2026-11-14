import type { OctaneNode } from "octane";
import type { AvailabilityBadgeProps } from "../../types";

export type BadgeFrameProps = AvailabilityBadgeProps & {
  /** The badge's drawing, in a `0 0 120 120` box. */
  children?: OctaneNode;
};
