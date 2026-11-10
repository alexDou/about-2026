import { useEffect } from "octane";
import { expandedBoard, pathOf } from "../../../../../hooks/useRoute";
import type { PanelId } from "../../../../../hooks/useRoute";
import { usePrevious } from "../usePrevious";
import type { RefObject } from "./types";

/**
 * Moves focus when the Expanded panel changes: opening (or switching) puts it on the Expanded
 * panel's heading, closing returns it to the Panel that was open. The first render moves nothing.
 */
export function useBoardFocus(expanded: PanelId | null, root: RefObject<HTMLElement>): void {
  const before = usePrevious(expanded);

  useEffect(() => {
    if (before === undefined) return;
    if (expanded) {
      root.current?.querySelector<HTMLElement>("h1")?.focus();
    } else if (before) {
      root.current
        ?.querySelector<HTMLElement>(`a[href="${pathOf(expandedBoard(before))}"]`)
        ?.focus();
    }
  });
}
