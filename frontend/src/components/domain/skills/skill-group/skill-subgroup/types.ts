import type { MessageId } from "../../../../../i18n";
import type { OverviewHeading } from "../../overviews";
import type { SkillEntrySkill } from "../../skill-entry";

/** A Skill subgroup as the block shows it. */
export type SkillSubgroupData = {
  id: string;
  name: MessageId;
  skills: readonly SkillEntrySkill[];
};

export type SkillSubgroupProps = {
  subgroup: SkillSubgroupData;
  /** The headings of the group the subgroup belongs to. */
  headings: readonly OverviewHeading[];
};
