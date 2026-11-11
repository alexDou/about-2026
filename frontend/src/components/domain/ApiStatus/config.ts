import type { MessageId } from "../../../i18n";
import { STATUS_TONES } from "../../ui/StatusBadge";
import type { StatusTone } from "../../ui/StatusBadge";

/** Whether the FastAPI backend is reachable, as far as the last health check knows. */
export const API_HEALTH = { checking: "checking", ok: "ok", down: "down" } as const;

/** How long a health request may take before the backend counts as down. */
export const HEALTH_TIMEOUT_MS = 6000;

export const TONE_BY_HEALTH: Readonly<Record<keyof typeof API_HEALTH, StatusTone>> = {
  [API_HEALTH.checking]: STATUS_TONES.neutral,
  [API_HEALTH.ok]: STATUS_TONES.ok,
  [API_HEALTH.down]: STATUS_TONES.down,
};

export const LABEL_BY_HEALTH: Readonly<Record<keyof typeof API_HEALTH, MessageId>> = {
  [API_HEALTH.checking]: "landing.status.checking",
  [API_HEALTH.ok]: "landing.status.ok",
  [API_HEALTH.down]: "landing.status.down",
};
