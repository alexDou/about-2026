import type { MessageId } from "../../../../i18n";
import type { OverviewHeading } from "../overviews";
import type { CertificateViewCertificate } from "./certificate-view";

/** What a Skill entry shows of a Skill. */
export type SkillEntrySkill = {
  id: string;
  name: MessageId;
  /** A short statement in the Owner's words. */
  overview: MessageId;
  /** The Certificates that back it, if any: each opens in its Certificate view. */
  certificates: readonly CertificateViewCertificate[];
};

export type SkillEntryProps = {
  skill: SkillEntrySkill;
  /** The headings of the Skill's group: they follow when its overview opens or closes. */
  headings: readonly OverviewHeading[];
};
