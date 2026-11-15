import { CornerButton } from "../../../ui/corner-button";
import { useEscapeKey } from "../../../../hooks/use-escape-key";
import styles from "./styles.module.css";
import type { ExpandedPanelProps } from "./types";

/** The one Panel opened to fill Explore: its page, a close corner, and Escape to close. */
export function ExpandedPanel({ closeLabel, onClose, children }: ExpandedPanelProps) @{
  useEscapeKey(onClose);

  <div class={styles["expanded-panel"]}>
    // First, so it comes first in the tab order; it sits over the page's top-right corner.
    <div class={styles["expanded-panel__close"]}>
      <CornerButton label={closeLabel} onClick={onClose} />
    </div>
    <div class={styles["expanded-panel__page"]}>{children}</div>
  </div>;
}
