import { Card } from "../../../ui/card";
import { headingsOf } from "../overviews";
import { SkillEntry } from "../skill-entry";
import { SKILL_HEADING_LEVELS, SkillHeading } from "../skill-heading";
import { SkillSubgroup } from "./skill-subgroup";
import styles from "./styles.module.css";
import type { SkillGroupProps } from "./types";

/**
 * A Skill group: a block on the light surface with the group's name, its Skills and its subgroups.
 * Its heading opens or closes every Skill beneath it, the subgroups' included.
 */
export function SkillGroup({ group }: SkillGroupProps) @{
  const headings = headingsOf(group);

  <Card>
    <SkillHeading
      id={group.id}
      name={group.name}
      level={SKILL_HEADING_LEVELS.group}
      headings={headings}
    />
    @if (group.skills.length > 0) {
      <ul class={styles["skill-group__skills"]}>
        @for (const skill of group.skills; key skill.id) {
          <SkillEntry skill={skill} headings={headings} />;
        }
      </ul>;
    }
    @for (const subgroup of group.subgroups; key subgroup.id) {
      <SkillSubgroup subgroup={subgroup} headings={headings} />;
    }
  </Card>;
}
