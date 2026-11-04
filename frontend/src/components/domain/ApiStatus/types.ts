import type { ApiHealth } from "../../../hooks/useApiHealth";
import type { StatusTone } from "../../ui/StatusBadge";

export type ApiStatusProps = Record<string, never>;

export const TONE_BY_HEALTH: Readonly<Record<ApiHealth, StatusTone>> = {
  checking: "neutral",
  ok: "ok",
  down: "down",
};
