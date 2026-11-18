import "octane/signals";
import { useIntl } from "../../../../hooks/use-intl";
import { headingOpen, overviews$, toggleHeading } from "../overviews";
import { SKILL_HEADING_LEVELS } from "./config";
import styles from "./styles.module.css";
import type { SkillHeadingProps } from "./types";

/**
 * The heading of a Skill group or subgroup. It holds a button with a state of its own, closed at
 * first: a click flips it and opens or closes every Skill beneath it.
 */
export function SkillHeading({ id, name, level, headings }: SkillHeadingProps) @{
  const intl = useIntl();
  const open = headingOpen(overviews$.get(), id);

  @if (level === SKILL_HEADING_LEVELS.group) {
    <h2 class={[styles["skill-heading"], styles["skill-heading--group"]]}>
      <button
        type="button"
        class={styles["skill-heading__button"]}
        aria-expanded={open}
        onClick={() => toggleHeading(headings, id)}
      >
        {intl.formatMessage({ id: name })}
      </button>
    </h2>;
  } @else {
    <h3 class={[styles["skill-heading"], styles["skill-heading--subgroup"]]}>
      <button
        type="button"
        class={styles["skill-heading__button"]}
        aria-expanded={open}
        onClick={() => toggleHeading(headings, id)}
      >
        {intl.formatMessage({ id: name })}
      </button>
    </h3>;
  }
}
