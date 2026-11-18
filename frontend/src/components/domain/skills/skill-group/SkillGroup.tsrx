import "octane/signals";
import { useIntl } from "../../../../hooks/use-intl";
import { groupOpen, headingsOf, overviews$, toggleGroup } from "../overviews";
import { SkillEntry } from "../skill-entry";
import { SkillSubgroup } from "./skill-subgroup";
import styles from "./styles.module.css";
import type { SkillGroupProps } from "./types";

/**
 * A Skill group: a band of the accordion. Closed, it shows its name and a "+"; a click opens it
 * with every overview in it, and the next click closes it. Its subgroups, or its plain list of
 * Skills, sit in a panel that opens and closes in CSS and stays out of reach while closed.
 */
export function SkillGroup({ group }: SkillGroupProps) @{
  const intl = useIntl();
  const open = groupOpen(overviews$.get(), group.id);
  const headings = headingsOf(group);
  const panelId = `skill-group-${group.id}`;

  <section class={[styles["skill-group"], open && styles["skill-group--open"]]}>
    <h2 class={styles["skill-group__heading"]}>
      <button
        type="button"
        class={styles["skill-group__toggle"]}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => toggleGroup(group)}
      >
        <span>{intl.formatMessage({ id: group.name })}</span>
        <span class={styles["skill-group__icon"]} aria-hidden="true" />
      </button>
    </h2>
    <div
      id={panelId}
      class={[styles["skill-group__panel"], open && styles["skill-group__panel--open"]]}
      inert={!open}
    >
      <div class={styles["skill-group__clip"]}>
        <div class={styles["skill-group__content"]}>
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
        </div>
      </div>
    </div>
  </section>;
}
