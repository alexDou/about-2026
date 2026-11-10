import type { PanelId } from "../../../../../hooks/useRoute";
import type { PanelTone } from "../../types";

export type PanelProps = {
  panel: PanelId;
  tone: PanelTone;
  entering: boolean;
};
