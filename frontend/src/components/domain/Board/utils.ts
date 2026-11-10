import { isPlainClick } from "../../../hooks/useRoute";
import type { PanelId } from "../../../hooks/useRoute";
import { SLOT_VIEWS } from "./components/Slot";
import type { SlotView } from "./components/Slot";
import { scrollEnded, scrollStarted, scrollToTop } from "./motion";
import type { BoardStage } from "./types";

/** What stands in `panel`'s slot at `stage`. */
export function viewOf(stage: BoardStage, panel: PanelId): SlotView {
  if (stage.layout === null) return SLOT_VIEWS.panel;
  return stage.layout === panel ? SLOT_VIEWS.expanded : SLOT_VIEWS.stripe;
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

/**
 * A click handler for a Stripe: from a scrolled page it scrolls up first, and `open`s the Panel
 * when the page has. The route change the click causes removes the page and the browser clamps the
 * scroll with it, so the scroll has to come first. Any other click is `onClick`'s as it is, a
 * modified one (a new tab) included.
 */
export function scrollingUpFirst(
  onClick: (event: MouseEvent) => void,
  open: () => void,
): (event: MouseEvent) => void {
  return (event) => {
    if (!isPlainClick(event) || window.scrollY <= 0) {
      onClick(event);
      return;
    }
    event.preventDefault();
    scrollStarted();
    void scrollToTop().then(() => {
      scrollEnded();
      open();
    });
  };
}
