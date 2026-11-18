import type { MessageId } from "../../../../i18n";
import type { CertificateDateValue } from "../format-certificate-date";
import type { SkillGroupData } from "../skill-group";

/** How the text builder turns the content into words, so it stays a pure function. */
export type SkillsTextFormat = {
  /** A message's text, in the Visitor's language. */
  message: (id: MessageId) => string;
  /** A Certificate's date as shown elsewhere: "Jul 2020", or the year alone. */
  date: (date: CertificateDateValue) => string;
  /** The word that starts a Certificate's line ("Certified"). */
  certified: string;
};

export type CopySkillsProps = {
  /** The Skill groups as the Skill group block shows them. */
  groups: readonly SkillGroupData[];
};
