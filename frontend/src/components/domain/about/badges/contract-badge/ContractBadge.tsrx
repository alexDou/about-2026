import { useId } from "octane";
import { ARC_SIDES } from "../config";
import { arcPath, scallopPath, starPath } from "../utils";
import { BadgeFrame } from "../../../../ui/badge-frame";
import styles from "./styles.module.css";
import type { ContractBadgeProps } from "./types";

const SEAL = scallopPath(60, 60, 54, 3, 12);
const STAR = starPath(60, 61, 21, 8.5, 5);
// The ring runs from radius 29 to 44. Text on the top arc stands on its inner side, text on the
// bottom arc hangs from its outer side (the letters point at the centre there).
const TOP_ARC = arcPath(60, 60, 32, ARC_SIDES.top);
const BOTTOM_ARC = arcPath(60, 60, 41, ARC_SIDES.bottom);

/** A scalloped gold seal: a dark ring with the text on it twice, a star in the middle. */
export function ContractBadge({ text, title }: ContractBadgeProps) @{
  const id = useId().replace(/[^\w-]/g, "");
  const topId = `${id}-top`;
  const bottomId = `${id}-bottom`;

  <BadgeFrame text={text} title={title}>
    <defs>
      <path id={topId} d={TOP_ARC} />
      <path id={bottomId} d={BOTTOM_ARC} />
    </defs>
    <path class={styles["contract-badge__seal"]} d={SEAL} />
    <circle class={styles["contract-badge__ring"]} cx="60" cy="60" r="44" />
    <circle class={styles["contract-badge__disc"]} cx="60" cy="60" r="29" />
    <circle class={styles["contract-badge__dot"]} cx="22.5" cy="60" r="1.8" />
    <circle class={styles["contract-badge__dot"]} cx="97.5" cy="60" r="1.8" />
    <path class={styles["contract-badge__star"]} d={STAR} />
    <text class={styles["contract-badge__text"]} fontSize="12">
      <textPath href={`#${topId}`} startOffset="50%">
        {text}
      </textPath>
    </text>
    <text class={styles["contract-badge__text"]} fontSize="12">
      <textPath href={`#${bottomId}`} startOffset="50%">
        {text}
      </textPath>
    </text>
  </BadgeFrame>;
}
