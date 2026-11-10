import cx from "classnames";
import styles from "./styles.module.css";
import type { SlotProps } from "./types";

/**
 * A Panel's place on the Board, which stays while the Panel is expanded and collapsed: only its
 * size changes, and the view inside fades out and in (see `useBoardSequence`). The slot and the
 * view carry `data-seq`: their transitions are the ones a stage waits for.
 */
export function Slot({ tone, view, shown, entering, children }: SlotProps) @{
  <li
    class={cx(styles["slot"], styles[tone], styles[view], entering && styles["entering"])}
    data-seq=""
  >
    <div class={cx(styles["view"], !shown && styles["hidden"])} inert={!shown} data-seq="">
      {children}
    </div>
  </li>;
}
