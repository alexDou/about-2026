import type { MessageId } from "../../../i18n";
import type { PROFILE_KINDS, PROFILE_LOOKS } from "./config";

export type ProfileKind = (typeof PROFILE_KINDS)[keyof typeof PROFILE_KINDS];

export type ProfileLook = (typeof PROFILE_LOOKS)[keyof typeof PROFILE_LOOKS];

/** A profile elsewhere: which icon it gets, the message its link is named by, and its address. */
export type Profile = {
  kind: ProfileKind;
  label: MessageId;
  url: string;
};

export type SocialLinksProps = {
  profiles: readonly Profile[];
  /** Defaults to the plain look. */
  look?: ProfileLook;
};
