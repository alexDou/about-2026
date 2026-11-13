import { enMessages, type MessageId } from "../../../i18n";
import {
  ABOUT_BADGE_KINDS,
  ABOUT_HOBBY_NUMBERS,
  ABOUT_LANGUAGE_KINDS,
  ABOUT_ROLE_NUMBERS,
} from "./config";
import type { AboutBadge, AboutContent, AboutHobby, AboutLanguage, AboutRole } from "./types";

const badge = (kind: (typeof ABOUT_BADGE_KINDS)[number]): AboutBadge => ({
  kind,
  text: `about.badge.${kind}.text`,
  title: `about.badge.${kind}.title`,
});

const MESSAGE_IDS = Object.keys(enMessages).filter(isMessageId);

function isMessageId(id: string): id is MessageId {
  return id in enMessages;
}

/** The Role's highlights: every `about.role.<n>.highlight.<position>` message, in position order. */
const highlightsOf = (n: (typeof ABOUT_ROLE_NUMBERS)[number]): MessageId[] => {
  const prefix = `about.role.${n}.highlight.`;
  const position = (id: string) => Number(id.slice(prefix.length));
  return MESSAGE_IDS.filter((id) => id.startsWith(prefix)).toSorted(
    (a, b) => position(a) - position(b),
  );
};

/** The intro is optional: a Role has one when the message file has `about.role.<n>.intro`. */
const introOf = (n: (typeof ABOUT_ROLE_NUMBERS)[number]): MessageId | undefined =>
  MESSAGE_IDS.find((id) => id === `about.role.${n}.intro`);

const role = (n: (typeof ABOUT_ROLE_NUMBERS)[number]): AboutRole => ({
  title: `about.role.${n}.title`,
  company: `about.role.${n}.company`,
  period: `about.role.${n}.period`,
  place: `about.role.${n}.place`,
  intro: introOf(n),
  highlights: highlightsOf(n),
  technologies: `about.role.${n}.technologies`,
});

const language = (kind: (typeof ABOUT_LANGUAGE_KINDS)[number]): AboutLanguage => ({
  name: `about.language.${kind}.name`,
  level: `about.language.${kind}.level`,
});

/** A language with a CEFR level: every one but the native one. */
const cefrLanguage = (kind: Exclude<(typeof ABOUT_LANGUAGE_KINDS)[number], "russian">) => ({
  ...language(kind),
  cefr: `about.language.${kind}.cefr` as const,
});

const hobby = (n: (typeof ABOUT_HOBBY_NUMBERS)[number]): AboutHobby => ({
  name: `about.hobby.${n}.name`,
  text: `about.hobby.${n}.text`,
});

/** The About Panel's content: which message each piece of it reads. */
export const ABOUT_CONTENT: AboutContent = {
  name: "about.name",
  headline: "about.headline",
  credo: "about.credo",
  bio: "about.bio",
  badges: ABOUT_BADGE_KINDS.map(badge),
  roles: ABOUT_ROLE_NUMBERS.map(role),
  education: {
    degree: "about.education.degree",
    school: "about.education.school",
    place: "about.education.place",
    year: "about.education.year",
    business: "about.education.business",
  },
  languages: [
    language("russian"),
    cefrLanguage("english"),
    cefrLanguage("german"),
    cefrLanguage("spanish"),
  ],
  hobbies: ABOUT_HOBBY_NUMBERS.map(hobby),
  cvLabel: "about.cv.label",
};
