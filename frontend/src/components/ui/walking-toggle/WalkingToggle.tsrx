import cx from "classnames";
import { useId, useState } from "octane";
import styles from "./styles.module.css";
import type { WalkingToggleProps } from "./types";

/**
 * A switch whose handle gets up on two legs and walks across its track, after the "toggle switch
 * with legs" (`support_files/skills/toogle/`), without the face and the dirt. It keeps the position
 * the Visitor gives it and reports it once the handle has arrived. It has no visible label: a
 * button named by what a click does ("Expand all", then "Collapse all"), shown as a hint to its
 * right on hover or keyboard focus, in CSS alone. No switch role: an action for a name and an
 * on/off state would contradict each other ("Collapse all, on").
 */
export function WalkingToggle({ labels, onChange }: WalkingToggleProps) @{
  const [on, setOn] = useState(false);
  const label = on ? labels.on : labels.off;
  // The walk plays only after the first change, so nothing moves on load.
  const [toggled, setToggled] = useState(false);
  // Only word characters: the id goes into `url(#…)`, the legs' clip.
  const id = useId().replace(/[^\w-]/g, "");

  const arrived = (event: Event) => {
    // The handle's own move or slide, not the legs' and feet's animations inside it.
    if (toggled && event.target === event.currentTarget) onChange(on);
  };

  <span class={styles["walking-toggle"]}>
    <button
      type="button"
      class={cx(styles["walking-toggle__track"], on && styles["walking-toggle__track--on"])}
      aria-label={label}
      onClick={() => {
        setOn(!on);
        setToggled(true);
      }}
    />
    <svg
      class={cx(
        styles["walking-toggle__handle"],
        toggled && styles["walking-toggle__handle--walking"],
      )}
      viewBox="0 0 24 36"
      aria-hidden="true"
      focusable="false"
      onAnimationEnd={arrived}
      onTransitionEnd={arrived}
    >
      <clipPath id={`${id}-legs`}>
        <rect y="18" width="24" height="18" />
      </clipPath>
      <g clipPath={`url(#${id}-legs)`}>
        <g class={styles["walking-toggle__legs"]} transform="translate(0, 13)">
          <g
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1"
            transform="translate(9, 35.5)"
          >
            <g>
              <g class={styles["walking-toggle__right-foot"]}>
                <polyline points="0 0, 3 0" />
              </g>
              <g class={styles["walking-toggle__right-leg-lower"]}>
                <polyline points="0 0, 0 -6" />
                <g transform="translate(0, -6)">
                  <g class={styles["walking-toggle__right-leg-upper"]}>
                    <polyline points="0 0, 0 -6" />
                  </g>
                </g>
              </g>
            </g>
            <g transform="translate(6, 0)">
              <g class={styles["walking-toggle__left-foot"]}>
                <polyline points="0 0, 3 0" />
              </g>
              <g class={styles["walking-toggle__left-leg-lower"]}>
                <polyline points="0 0, 0 -6" />
                <g transform="translate(0, -6)">
                  <g class={styles["walking-toggle__left-leg-upper"]}>
                    <polyline points="0 0, 0 -6" />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g class={styles["walking-toggle__body"]} transform="translate(0, 12)">
        <circle class={styles["walking-toggle__head"]} r="12" cx="12" cy="12" />
      </g>
    </svg>
    // The hint repeats the switch's name, so assistive tech skips it. It follows the track, so
    // the track's :hover and :focus-visible show it (`~`).
    <span class={styles["walking-toggle__hint"]} aria-hidden="true">
      {label}
    </span>
  </span>;
}
