import { useIntl } from "../../../hooks/use-intl";
import { StatusBadge } from "../../ui/status-badge";
import { LABEL_BY_HEALTH, TONE_BY_HEALTH } from "./config";
import { useApiHealth } from "./hooks/use-api-health";
import styles from "./styles.module.css";

/** Shows whether the FastAPI backend is reachable. */
export function ApiStatus() @{
  const health = useApiHealth();
  const intl = useIntl();
  <div class={styles["api-status"]} data-testid="api-status">
    <StatusBadge
      label={intl.formatMessage({ id: LABEL_BY_HEALTH[health] })}
      tone={TONE_BY_HEALTH[health]}
    />
  </div>;
}
