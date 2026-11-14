import { useId } from "octane";
import { ARC_SIDES, ARC_TEXT_SEPARATOR } from "../../config";
import { arcPath, starPath } from "../../utils";
import { BadgeFrame } from "../BadgeFrame";
import styles from "./styles.module.css";
import type { RemoteWorkBadgeProps } from "./types";

const ZIGZAG = starPath(60, 60, 58, 54, 40);
// The text band runs from radius 28 to 51: the top arc stands on its inner side, the bottom arc
// hangs from its outer side.
const TOP_ARC = arcPath(60, 60, 35, ARC_SIDES.top);
const BOTTOM_ARC = arcPath(60, 60, 45, ARC_SIDES.bottom);

/** A zig-zag blue seal: the text before the slash on the top arc, the rest on the bottom arc. */
export function RemoteWorkBadge({ text, title }: RemoteWorkBadgeProps) @{
  const id = useId().replace(/[^\w-]/g, "");
  const topId = `${id}-top`;
  const bottomId = `${id}-bottom`;
  const [top = "", ...bottom] = text.split(ARC_TEXT_SEPARATOR);

  <BadgeFrame text={text} title={title}>
    <defs>
      <path id={topId} d={TOP_ARC} />
      <path id={bottomId} d={BOTTOM_ARC} />
    </defs>
    <path class={styles["remote-work-badge__zigzag"]} d={ZIGZAG} />
    <circle class={styles["remote-work-badge__disc"]} cx="60" cy="60" r="51" />
    <circle class={styles["remote-work-badge__core"]} cx="60" cy="60" r="27" />
    <g class={styles["remote-work-badge__icon"]}>
      <path d="M 60 41 L 79 60 L 60 79 L 41 60 Z" />
      <path d="M 49 63 L 60 52 L 71 63" />
      <path d="M 55 69 L 60 64 L 65 69" />
    </g>
    <text class={styles["remote-work-badge__top"]} fontSize="11">
      <textPath href={`#${topId}`} startOffset="50%">
        {top}
      </textPath>
    </text>
    <text class={styles["remote-work-badge__bottom"]} fontSize="13">
      <textPath href={`#${bottomId}`} startOffset="50%">
        {bottom.join(ARC_TEXT_SEPARATOR)}
      </textPath>
    </text>
  </BadgeFrame>;
}
