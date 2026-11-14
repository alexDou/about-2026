import { starPath } from "../utils";
import { BadgeFrame } from "../../../../ui/badge-frame";
import styles from "./styles.module.css";
import type { FullTimeBadgeProps } from "./types";

/** Three stars, the middle one larger, above and below the ribbon. */
const STARS = [
  starPath(60, 27, 7, 3, 5),
  starPath(45, 31, 4.5, 2, 5),
  starPath(75, 31, 4.5, 2, 5),
  starPath(60, 93, 7, 3, 5),
  starPath(45, 89, 4.5, 2, 5),
  starPath(75, 89, 4.5, 2, 5),
];

/** A round stamp with a green ribbon across it, the text on the ribbon. */
export function FullTimeBadge({ text, title }: FullTimeBadgeProps) @{
  <BadgeFrame text={text} title={title}>
    <circle class={styles["full-time-badge__stamp"]} cx="60" cy="60" r="56" />
    <circle class={styles["full-time-badge__inner-ring"]} cx="60" cy="60" r="45" />
    @for (const star of STARS; index i; key i) {
      <path class={styles["full-time-badge__star"]} d={star} />;
    }
    <g transform="rotate(-12 60 60)">
      <path class={styles["full-time-badge__tail"]} d="M 0 52 H 18 V 86 H 0 L 8 69 Z" />
      <path class={styles["full-time-badge__tail"]} d="M 120 52 H 102 V 86 H 120 L 112 69 Z" />
      <rect class={styles["full-time-badge__ribbon"]} x="10" y="43" width="100" height="34" />
      <text class={styles["full-time-badge__text"]} fontSize="16" x="60" y="60" dy="0.35em">
        {text}
      </text>
    </g>
  </BadgeFrame>;
}
