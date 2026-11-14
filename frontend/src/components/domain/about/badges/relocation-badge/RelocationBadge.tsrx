import { BadgeFrame } from "../../../../ui/badge-frame";
import styles from "./styles.module.css";
import type { RelocationBadgeProps } from "./types";

/** A blue shopping cart on two wheels, the text on its basket. */
export function RelocationBadge({ text, title }: RelocationBadgeProps) @{
  <BadgeFrame text={text} title={title}>
    <path
      class={styles["relocation-badge__basket"]}
      d="M 10 24 L 110 24 L 96 80 L 22 80 L 17 54 Z"
    />
    <path class={styles["relocation-badge__rim"]} d="M 20 31 L 102 31 L 91 73 L 29 73" />
    <ellipse class={styles["relocation-badge__wheel"]} cx="34" cy="100" rx="12" ry="11" />
    <ellipse class={styles["relocation-badge__wheel"]} cx="86" cy="100" rx="12" ry="11" />
    <circle class={styles["relocation-badge__hub"]} cx="34" cy="100" r="4.5" />
    <circle class={styles["relocation-badge__hub"]} cx="86" cy="100" r="4.5" />
    <text class={styles["relocation-badge__text"]} fontSize="11.5" x="62" y="52" dy="0.35em">
      {text}
    </text>
  </BadgeFrame>;
}
