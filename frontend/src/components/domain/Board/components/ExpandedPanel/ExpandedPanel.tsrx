import { useEscapeKey } from "./hooks/useEscapeKey";
import styles from "./styles.module.css";
import type { ExpandedPanelProps } from "./types";

/** The one Panel opened to fill the Board: its page, a close button, and Escape to close. */
export function ExpandedPanel({ closeLabel, onClose, children }: ExpandedPanelProps) @{
  useEscapeKey(onClose);

  <div class={styles["expanded-panel"]}>
    // Sticky, so the button stays at the top right in view while the page scrolls.
    <div class={styles["expanded-panel__close-bar"]}>
      <button
        type="button"
        class={styles["expanded-panel__close"]}
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
  </div>;
}
