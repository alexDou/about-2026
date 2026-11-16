import type { MessageId } from "../../../i18n";
import type {
  CERTIFICATE_IDS,
  CERTIFICATE_ISSUER_IDS,
  SKILL_GROUP_IDS,
  SKILL_IDS,
  SKILL_SUBGROUP_IDS,
} from "./config";

export type CertificateId = (typeof CERTIFICATE_IDS)[number];
export type CertificateIssuerId = (typeof CERTIFICATE_ISSUER_IDS)[number];
export type SkillId = (typeof SKILL_IDS)[number];
export type SkillGroupId = (typeof SKILL_GROUP_IDS)[number];
export type SkillSubgroupId = (typeof SKILL_SUBGROUP_IDS)[number];

/** When a Certificate was issued; some give a year only. Formatted for the locale where shown. */
export type CertificateDate = {
  year: number;
  /** 1 to 12. */
  month?: number;
};

/** Proof from an outside issuer that the Owner passed a test or completed a course. */
export type Certificate = {
  id: CertificateId;
  title: MessageId;
  issuer: MessageId;
  date: CertificateDate;
  /** Where the Owner placed, such as "Top 10%". */
  ranking?: MessageId;
  /** The issuer's own page that verifies the Certificate. */
  verifyUrl?: string;
  /** The Certificate's image, a path from the site root. */
  image: string;
};

/**
 * A named thing the Owner knows. Its depth is told in the overview's words: there is no rating,
 * level or years field.
 */
export type Skill = {
  id: SkillId;
  name: MessageId;
  /** A short statement in the Owner's words. */
  overview: MessageId;
  /** The Certificates that back this Skill; none for most. */
  certificates: readonly Certificate[];
};

/** A named set of Skills inside a Skill group, one level deep. It has no statement. */
export type SkillSubgroup = {
  id: SkillSubgroupId;
  name: MessageId;
  skills: readonly Skill[];
};

/** A named set of related Skills, with the Skill subgroups it may hold. It has no statement. */
export type SkillGroup = {
  id: SkillGroupId;
  name: MessageId;
  skills: readonly Skill[];
  subgroups: readonly SkillSubgroup[];
};

/**
 * Everything the Skills Panel shows, as message ids: the text is in `i18n/en/skills.json` and read
 * through `useIntl()`.
 */
export type SkillsContent = {
  /** In the order they show. */
  groups: readonly SkillGroup[];
};
