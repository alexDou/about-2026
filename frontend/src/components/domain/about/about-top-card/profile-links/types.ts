import type { MessageId } from "../../../../../i18n";
import type { PROFILE_KINDS } from "./config";

export type ProfileKind = (typeof PROFILE_KINDS)[keyof typeof PROFILE_KINDS];

/** A profile elsewhere: which icon it gets, the message its link is named by, and its address. */
export type Profile = {
  kind: ProfileKind;
  label: MessageId;
  url: string;
};

export type ProfileLinksProps = {
  profiles: readonly Profile[];
};
