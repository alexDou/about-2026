import type { MessageId } from "../../../i18n";
import type { StatusTone } from "../../ui/StatusBadge";
import type { ApiHealth } from "./types";

export const TONE_BY_HEALTH: Readonly<Record<ApiHealth, StatusTone>> = {
  checking: "neutral",
  ok: "ok",
  down: "down",
};

export const LABEL_BY_HEALTH: Readonly<Record<ApiHealth, MessageId>> = {
  checking: "landing.status.checking",
  ok: "landing.status.ok",
  down: "landing.status.down",
};
