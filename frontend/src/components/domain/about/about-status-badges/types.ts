import type { MessageId } from "../../../../i18n";
import type { STATUS_BADGE_KINDS } from "./config";

export type AboutStatusBadgeKind = (typeof STATUS_BADGE_KINDS)[keyof typeof STATUS_BADGE_KINDS];

/** A status badge: which drawing it gets, and the messages for its text and its `title`. */
export type AboutStatusBadge = {
  kind: AboutStatusBadgeKind;
  text: MessageId;
  title: MessageId;
};

export type AboutStatusBadgesProps = {
  badges: readonly AboutStatusBadge[];
};
