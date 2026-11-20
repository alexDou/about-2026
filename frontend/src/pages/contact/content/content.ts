import { CONTACT_PROFILE_URLS } from "./config";
import type { ContactContent, ContactProfileKind } from "./types";

const profile = (kind: ContactProfileKind) => ({
  kind,
  label: `contact.profile.${kind}.label` as const,
  url: CONTACT_PROFILE_URLS[kind],
});

/** The Contact Panel's content: which message each piece of it reads. */
export const CONTACT_CONTENT: ContactContent = {
  remote: "contact.remote",
  profiles: [profile("linkedin"), profile("xing")],
  notice: "contact.notice",
};
