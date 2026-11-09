export type ApiStatusProps = Record<string, never>;

/** Whether the FastAPI backend is reachable, as far as the last health check knows. */
export type ApiHealth = "checking" | "ok" | "down";
