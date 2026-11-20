import type { MessageId } from "../../../i18n";
import type { CONTACT_PROFILE_URLS } from "./config";

export type ContactProfileKind = keyof typeof CONTACT_PROFILE_URLS;

/** A profile elsewhere: the name its link is read by, and its address. */
export type ContactProfile = {
  kind: ContactProfileKind;
  label: MessageId;
  url: string;
};

/** What the Contact page says: which message each piece of it reads. */
export type ContactContent = {
  remote: MessageId;
  profiles: readonly ContactProfile[];
  notice: MessageId;
};
