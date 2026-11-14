import type { API_HEALTH } from "./config";

export type ApiStatusProps = Record<string, never>;

/** Whether the FastAPI backend is reachable, as far as the last health check knows. */
export type ApiHealth = (typeof API_HEALTH)[keyof typeof API_HEALTH];
