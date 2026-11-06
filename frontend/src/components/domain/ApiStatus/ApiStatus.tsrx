import { useApiHealth } from "../../../hooks/useApiHealth";
import { StatusBadge } from "../../ui/StatusBadge";
import styles from "./styles.module.css";
import { TONE_BY_HEALTH } from "./types";

/** Shows whether the FastAPI backend is reachable. */
export function ApiStatus() @{
  const health = useApiHealth();
  <div class={styles["status"]} data-testid="api-status">
    <StatusBadge label={`API: ${health}`} tone={TONE_BY_HEALTH[health]} />
  </div>;
}
