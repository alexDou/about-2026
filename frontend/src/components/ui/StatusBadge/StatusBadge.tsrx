import { STATUS_TONES } from "./config";
import styles from "./styles.module.css";
import type { StatusBadgeProps } from "./types";

export function StatusBadge({ label, tone }: StatusBadgeProps) @{
  <span
    class={[
      styles["status-badge"],
      tone !== STATUS_TONES.neutral && styles[`status-badge--${tone}`],
    ]}
    data-tone={tone}
  >
    {label}
  </span>;
}
