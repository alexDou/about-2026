import type { MessageId } from "../../../../i18n";
import type { OverviewHeading } from "../overviews";

/** What a Skill entry shows of a Skill. */
export type SkillEntrySkill = {
  id: string;
  name: MessageId;
  /** A short statement in the Owner's words. */
  overview: MessageId;
};

export type SkillEntryProps = {
  skill: SkillEntrySkill;
  /** The headings of the Skill's group: they follow when its overview opens or closes. */
  headings: readonly OverviewHeading[];
};
