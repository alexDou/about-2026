import { useEffect, useState } from "octane";
import { fetchHealth } from "../../../../../services/api";
import { API_HEALTH } from "../../config";
import type { ApiHealth } from "../../types";

/** Polls the backend health endpoint once on mount. */
export function useApiHealth(): ApiHealth {
  const [health, setHealth] = useState<ApiHealth>(API_HEALTH.checking);

  useEffect(() => {
    const controller = new AbortController();
    fetchHealth(controller.signal)
      .then(() => setHealth(API_HEALTH.ok))
      .catch(() => {
        if (!controller.signal.aborted) setHealth(API_HEALTH.down);
      });
    return () => controller.abort();
  }, []);

  return health;
}
