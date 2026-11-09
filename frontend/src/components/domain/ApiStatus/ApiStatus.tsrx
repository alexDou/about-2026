import { useApiHealth } from "../../../hooks/useApiHealth";
import { useIntl } from "../../../hooks/useIntl";
import { StatusBadge } from "../../ui/StatusBadge";
import styles from "./styles.module.css";
import { LABEL_BY_HEALTH, TONE_BY_HEALTH } from "./types";

/** Shows whether the FastAPI backend is reachable. */
export function ApiStatus() @{
  const health = useApiHealth();
  const intl = useIntl();
  <div class={styles["status"]} data-testid="api-status">
    <StatusBadge
      label={intl.formatMessage({ id: LABEL_BY_HEALTH[health] })}
      tone={TONE_BY_HEALTH[health]}
    />
  </div>;
}
