import "octane/signals";
import { useEffect } from "octane";
import { health$, checkHealth, checkHealthOnce } from "../../health";
import type { ApiHealth } from "../../types";
import type { UseApiHealthOptions } from "./types";

/**
 * The backend's shared health. The first component to mount makes the page load's request; one
 * that passes `recheck` asks again each time it mounts, so a recovered backend shows up.
 */
export function useApiHealth({ recheck = false }: UseApiHealthOptions = {}): ApiHealth {
  useEffect(() => {
    if (recheck) checkHealth();
    else checkHealthOnce();
  });

  return health$.get();
}
