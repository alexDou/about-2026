import { BOARD_KIND, boardAt, isPlainClick } from "../../../hooks/use-route";
import type { BoardState, BoardViewTransition, PanelId } from "../../../hooks/use-route";
import { SLOT_VIEWS } from "./components/slot";
import type { SlotView } from "./components/slot";
import { CHANGE_KINDS } from "./config";
import { scrollEnded, scrollStarted, scrollToTop } from "./motion";
import type { ChangeKind } from "./types";

/** How the Board moves from `from` to `to`; `null` when it stays. */
export function changeKind(from: BoardState, to: BoardState): ChangeKind | null {
  if (from === to) return null;
  if (to.kind === BOARD_KIND.default) return CHANGE_KINDS.close;
  return from.kind === BOARD_KIND.default ? CHANGE_KINDS.open : CHANGE_KINDS.switch;
}

/**
 * The View Transition types of a change of route from `from` to `to`, which the Slot's stylesheet
 * plays: the kind of change. `false` starts no View Transition: to or from a screen with no Board
 * (`null`), or when the Board stays.
 */
export function transitionTypes(from: BoardState | null, to: BoardState | null): string[] | false {
  if (from === null || to === null) return false;
  const kind = changeKind(from, to);
  if (kind === null) return false;
  return [kind];
}

/** The router's View Transition for every navigation (`createAppRouter`). */
export const boardViewTransition: BoardViewTransition = {
  types: ({ fromLocation, toLocation }) =>
    transitionTypes(boardAt(fromLocation?.pathname), boardAt(toLocation.pathname)),
};

/** What stands in `panel`'s slot while `expanded` is the Expanded panel (`null`: none is). */
export function viewOf(expanded: PanelId | null, panel: PanelId): SlotView {
  if (expanded === null) return SLOT_VIEWS.panel;
  return expanded === panel ? SLOT_VIEWS.expanded : SLOT_VIEWS.stripe;
}

/**
 * A click handler that does nothing while the Board is busy. A plain click is also kept from
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
