import type { AboutBadge } from "../../content";
import type { ARC_SIDES } from "./config";

export type ArcSide = (typeof ARC_SIDES)[keyof typeof ARC_SIDES];

/** What every badge shows: the words on its face and the `title` that explains it. */
export type AvailabilityBadgeProps = {
  text: string;
  title: string;
};

export type AvailabilityBadgesProps = {
  badges: readonly AboutBadge[];
};
