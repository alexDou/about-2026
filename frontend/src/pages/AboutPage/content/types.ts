import type { MessageId } from "../../../i18n";
import type { ABOUT_BADGE_KINDS } from "./config";

export type AboutBadgeKind = (typeof ABOUT_BADGE_KINDS)[number];

/** An availability badge: what its face says and the `title` that explains it. */
export type AboutBadge = {
  kind: AboutBadgeKind;
  text: MessageId;
  title: MessageId;
};

/** One position in the work history. `technologies` is one message: a comma-separated list. */
export type AboutRole = {
  title: MessageId;
  company: MessageId;
  period: MessageId;
  place: MessageId;
  text: MessageId;
  technologies: MessageId;
};

export type AboutEducation = {
  degree: MessageId;
  school: MessageId;
  place: MessageId;
  year: MessageId;
  /** One sentence on the product and business thinking the degree built. */
  business: MessageId;
};

/** A spoken language: its name, the level in words and the CEFR level (none for a native one). */
export type AboutLanguage = {
  name: MessageId;
  level: MessageId;
  cefr?: MessageId;
};

export type AboutHobby = {
  name: MessageId;
  /** A few words of the Owner's own. */
  text: MessageId;
};

/**
 * Everything the About Panel shows, as message ids: the text is in `i18n/en/about.json`
 * and read through `useIntl()`.
 */
export type AboutContent = {
  name: MessageId;
  headline: MessageId;
  credo: MessageId;
  bio: MessageId;
  badges: readonly AboutBadge[];
  /** Newest first. */
  roles: readonly AboutRole[];
  education: AboutEducation;
  languages: readonly AboutLanguage[];
  hobbies: readonly AboutHobby[];
  cvLabel: MessageId;
};
