import type { MessageId } from "../../../../i18n";
import type { SkillEntrySkill } from "../skill-entry";
import type { SkillSubgroupData } from "./skill-subgroup";

/** A Skill group as the block shows it: its Skills first, then its subgroups. */
export type SkillGroupData = {
  id: string;
  name: MessageId;
  skills: readonly SkillEntrySkill[];
  subgroups: readonly SkillSubgroupData[];
};

export type SkillGroupProps = {
  group: SkillGroupData;
};
