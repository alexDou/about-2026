import cx from "classnames";
import { useEscapeKey } from "./hooks/useEscapeKey";
import styles from "./styles.module.css";
import type { ExpandedPanelProps } from "./types";

/** The one Panel opened to fill the Board: its page, a close button, and Escape to close. */
export function ExpandedPanel({
  tone,
  closeLabel,
  onClose,
  children,
}: ExpandedPanelProps) @{
  useEscapeKey(onClose);

  <li class={cx(styles["expanded"], styles[tone])}>
    // Zero height, so it takes no room, and sticky, so the button stays at the top right in view.
    <div class={styles["closeBar"]}>
      <button
        type="button"
        class={styles["close"]}
        title={closeLabel}
        aria-label={closeLabel}
        onClick={onClose}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M8 8l8 8M16 8l-8 8" />
        </svg>
      </button>
    </div>
    {children}
  </li>;
}
