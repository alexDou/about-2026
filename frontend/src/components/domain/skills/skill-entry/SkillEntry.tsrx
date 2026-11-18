import "octane/signals";
import { useIntl } from "../../../../hooks/use-intl";
import { overviews$, skillOpen, toggleSkill } from "../overviews";
import styles from "./styles.module.css";
import type { SkillEntryProps } from "./types";

/**
 * One Skill: its filled arrow, its name and its overview. The arrow is the only toggle; the name
 * is plain, selectable text. A closed overview stays in the page, out of sight and out of reach
 * (`inert`), so the open and close can be a CSS transition.
 */
export function SkillEntry({ skill, headings }: SkillEntryProps) @{
  const intl = useIntl();
  const open = skillOpen(overviews$.get(), skill.id);
  const name = intl.formatMessage({ id: skill.name });
  const overviewId = `skill-overview-${skill.id}`;

  <li class={styles["skill-entry"]}>
    <div class={styles["skill-entry__row"]}>
      <button
        type="button"
        class={[styles["skill-entry__arrow"], open && styles["skill-entry__arrow--open"]]}
        aria-expanded={open}
        aria-controls={overviewId}
        aria-label={intl.formatMessage({ id: "skills.overviewToggle" }, { name })}
        onClick={() => toggleSkill(headings, skill.id)}
      >
        <span class={styles["skill-entry__arrow-shape"]} />
      </button>
      <span class={styles["skill-entry__name"]}>{name}</span>
    </div>
    <div
      id={overviewId}
      class={[styles["skill-entry__overview"], open && styles["skill-entry__overview--open"]]}
      inert={!open}
    >
      <p class={styles["skill-entry__overview-text"]}>
        {intl.formatMessage({ id: skill.overview })}
      </p>
    </div>
  </li>;
}
