import "octane/signals";
import cx from "classnames";
import { entering$ } from "../../motion";
import { SLOT_VIEWS } from "./config";
import styles from "./styles.module.css";
import type { SlotProps } from "./types";

/**
 * A Panel's place on the Board, which stays while the Panel is expanded and collapsed: only its
 * size changes, and the view inside is swapped. The slot and its view each carry a
 * `view-transition-name`, and the stylesheet plays a change of route on them.
 */
export function Slot({ tone, view, children }: SlotProps) @{
  <li
    class={cx(
      styles["slot"],
      styles[`slot--${tone}`],
      styles[`slot--${view}`],
      entering$.get() && view === SLOT_VIEWS.panel && styles["slot--entering"],
    )}
  >
    <div class={styles["slot__view"]}>{children}</div>
  </li>;
}
