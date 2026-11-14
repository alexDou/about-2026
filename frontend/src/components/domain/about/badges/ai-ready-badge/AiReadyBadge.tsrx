import { useId } from "octane";
import { polygonPath } from "../utils";
import { BadgeFrame } from "../../../../ui/badge-frame";
import styles from "./styles.module.css";
import type { AiReadyBadgeProps } from "./types";

const HEXAGON = polygonPath(60, 60, 58, 6);

/** A purple hexagon in three bands: light, the text on a dark one, cyan. */
export function AiReadyBadge({ text, title }: AiReadyBadgeProps) @{
  const id = useId().replace(/[^\w-]/g, "");
  const clipId = `${id}-clip`;
  const [first = "", ...rest] = text.split(" ");

  <BadgeFrame text={text} title={title}>
    <defs>
      <clipPath id={clipId}>
        <path d={HEXAGON} />
      </clipPath>
    </defs>
    <path class={styles["ai-ready-badge__hexagon"]} d={HEXAGON} />
    <g clipPath={`url(#${clipId})`}>
      <rect class={styles["ai-ready-badge__top"]} x="0" y="0" width="120" height="42" />
      <rect class={styles["ai-ready-badge__band"]} x="0" y="42" width="120" height="36" />
      <rect class={styles["ai-ready-badge__bottom"]} x="0" y="78" width="120" height="42" />
    </g>
    <text class={styles["ai-ready-badge__first"]} fontSize="24" x="34" y="60" dy="0.35em">
      {first}
    </text>
    <text class={styles["ai-ready-badge__rest"]} fontSize="15" x="80" y="60" dy="0.35em">
      {rest.join(" ")}
    </text>
  </BadgeFrame>;
}
