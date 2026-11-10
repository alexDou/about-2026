import { isPlainClick } from "../../../hooks/useRoute";
import type { PanelId } from "../../../hooks/useRoute";
import type { SlotView } from "./components/Slot";
import type { BoardStage } from "./types";

/** What stands in `panel`'s slot at `stage`. */
export function viewOf(stage: BoardStage, panel: PanelId): SlotView {
  if (stage.layout === null) return "panel";
  return stage.layout === panel ? "expanded" : "stripe";
}

/**
 * A click handler that does nothing while a sequence runs. A plain click is also kept from
 * following its link; a modified one (a new tab) is left to the browser.
 */
export function ignoredWhileBusy(
  busy: boolean,
  onClick: (event: MouseEvent) => void,
): (event: MouseEvent) => void {
  return (event) => {
    if (!busy) onClick(event);
    else if (isPlainClick(event)) event.preventDefault();
  };
}
