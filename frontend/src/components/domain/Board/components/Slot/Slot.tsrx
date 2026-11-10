import "octane/signals";
import cx from "classnames";
import { entering$, slotResized, viewFaded } from "../../motion";
import { FADE_PROPERTY, RESIZE_PROPERTY, SLOT_VIEWS } from "./config";
import styles from "./styles.module.css";
import type { SlotProps } from "./types";
import { endedOn } from "./utils";

/**
 * A Panel's place on the Board, which stays while the Panel is expanded and collapsed: only its
 * size changes, and the view inside fades out and in. The slot and its view tell the Board's
 * motion when their transitions end, which is what a stage waits for.
 */
export function Slot({ panel, tone, view, shown, children }: SlotProps) @{
  <li
    class={cx(
      styles["slot"],
      styles[tone],
      styles[view],
      entering$.get() && view === SLOT_VIEWS.panel && styles["entering"],
    )}
    onTransitionEnd={(event) => {
      if (endedOn(event, RESIZE_PROPERTY)) slotResized(panel);
    }}
  >
    <div
      class={cx(styles["view"], !shown && styles["hidden"])}
      inert={!shown}
      onTransitionEnd={(event) => {
        if (endedOn(event, FADE_PROPERTY)) viewFaded(panel);
      }}
    >
      {children}
    </div>
  </li>;
}
