import type { MessageId } from "../../../../i18n";
import type { OverviewHeading } from "../overviews";
import type { SKILL_HEADING_LEVELS } from "./config";

export type SkillHeadingLevel = (typeof SKILL_HEADING_LEVELS)[keyof typeof SKILL_HEADING_LEVELS];

export type SkillHeadingProps = {
  /** The group's or subgroup's id: the key of its state. */
  id: string;
  name: MessageId;
  level: SkillHeadingLevel;
  /** The headings of the group the heading belongs to. */
  headings: readonly OverviewHeading[];
};
