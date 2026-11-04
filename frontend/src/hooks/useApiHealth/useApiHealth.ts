import { useEffect, useState } from "octane";
import { fetchHealth } from "../../services/api";
import type { ApiHealth } from "./types";

/** Polls the backend health endpoint once on mount. */
export function useApiHealth(): ApiHealth {
  const [health, setHealth] = useState<ApiHealth>("checking");

  useEffect(() => {
    const controller = new AbortController();
    fetchHealth(controller.signal)
      .then(() => setHealth("ok"))
      .catch(() => {
        if (!controller.signal.aborted) setHealth("down");
      });
    return () => controller.abort();
  }, []);

  return health;
}
