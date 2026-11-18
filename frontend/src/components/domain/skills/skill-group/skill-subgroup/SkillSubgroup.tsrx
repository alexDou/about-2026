import "octane/signals";
import { useIntl } from "../../../../../hooks/use-intl";
import { headingOpen, overviews$, toggleHeading } from "../../overviews";
import { SkillEntry } from "../../skill-entry";
import styles from "./styles.module.css";
import type { SkillSubgroupProps } from "./types";

/**
 * A Skill subgroup: a padded box inside an open group, darker than the band and darker again while
 * expanded. Its heading opens or closes every overview in it and follows them by the rule.
 */
export function SkillSubgroup({ subgroup, headings }: SkillSubgroupProps) @{
  const intl = useIntl();
  const open = headingOpen(overviews$.get(), subgroup.id);

  <section class={[styles["skill-subgroup"], open && styles["skill-subgroup--open"]]}>
    <h3 class={styles["skill-subgroup__heading"]}>
      <button
        type="button"
        class={styles["skill-subgroup__toggle"]}
        aria-expanded={open}
        onClick={() => toggleHeading(headings, subgroup.id)}
      >
        {intl.formatMessage({ id: subgroup.name })}
      </button>
    </h3>
    <ul class={styles["skill-subgroup__skills"]}>
      @for (const skill of subgroup.skills; key skill.id) {
        <SkillEntry skill={skill} headings={headings} />;
      }
    </ul>
  </section>;
}
