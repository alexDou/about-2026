import type { PanelId } from "../../../hooks/useRoute";
import type { PanelTone } from "./components/Panel";

/** The tone of each Panel: the palette in Board order, left to right and top to bottom. */
export const TONE_BY_PANEL = {
  about: "ink",
  whatIDo: "mist",
  skills: "teal",
  chatWithMe: "blue",
  contact: "green",
} as const satisfies Record<PanelId, PanelTone>;
