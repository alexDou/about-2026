import { getJson } from "./client";
import type { HealthResponse } from "./types";

export function fetchHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return getJson<HealthResponse>("/health", { signal });
}
