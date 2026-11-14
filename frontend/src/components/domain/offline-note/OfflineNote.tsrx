import { API_HEALTH, useApiHealth } from "../api-status";
import { useIntl } from "../../../hooks/use-intl";
import styles from "./styles.module.css";

/**
 * Tells the Visitor that the backend is unreachable. Its page still opens. It asks the backend
 * again each time it appears. The status region stays in the page so that the note is announced.
 */
export function OfflineNote() @{
  const intl = useIntl();
  const health = useApiHealth({ recheck: true });

  <output class={styles["offline-note"]}>
    @if (health === API_HEALTH.down) {
      <span class={styles["offline-note__text"]}>
        {intl.formatMessage({ id: "offline.note" })}
      </span>;
    }
  </output>;
}
