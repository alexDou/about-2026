import { SkillEntry } from "../../skill-entry";
import { SKILL_HEADING_LEVELS, SkillHeading } from "../../skill-heading";
import styles from "./styles.module.css";
import type { SkillSubgroupProps } from "./types";

/** A Skill subgroup inside a group's block: its name and its Skills. */
export function SkillSubgroup({ subgroup, headings }: SkillSubgroupProps) @{
  <section class={styles["skill-subgroup"]}>
    <SkillHeading
      id={subgroup.id}
      name={subgroup.name}
      level={SKILL_HEADING_LEVELS.subgroup}
      headings={headings}
    />
    <ul class={styles["skill-subgroup__skills"]}>
      @for (const skill of subgroup.skills; key skill.id) {
        <SkillEntry skill={skill} headings={headings} />;
      }
    </ul>
  </section>;
}
