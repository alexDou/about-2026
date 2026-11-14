import { starPath } from "../utils";
import { BadgeFrame } from "../../../../ui/badge-frame";
import styles from "./styles.module.css";
import type { AvailableNowBadgeProps } from "./types";

const BURST = starPath(60, 60, 58, 47, 20);

/** A green starburst: the text on two lines, the first word small, the rest large. */
export function AvailableNowBadge({ text, title }: AvailableNowBadgeProps) @{
  const [first = "", ...rest] = text.split(" ");

  <BadgeFrame text={text} title={title}>
    <path class={styles["available-now-badge__burst"]} d={BURST} />
    <text class={styles["available-now-badge__first"]} fontSize="15" x="60" y="55">
      {first}
    </text>
    <text class={styles["available-now-badge__rest"]} fontSize="27" x="60" y="82">
      {rest.join(" ")}
    </text>
  </BadgeFrame>;
}
