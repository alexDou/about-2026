import { useEffect, useState } from "octane";
import { expandedBoard, pathOf } from "../../../../../hooks/use-route";
import type { PanelId } from "../../../../../hooks/use-route";
import type { RefObject } from "../../types";
import { PAGE_HEADING } from "./config";

/**
 * Moves focus when the Board shows another Expanded panel (`expanded`; `null`: none, the Panels):
 * opening (or switching) puts it on the Expanded panel's heading, closing returns it to the Panel
 * that was open. The first render moves nothing.
 */
export function useBoardFocus(expanded: PanelId | null, root: RefObject<HTMLElement>): void {
  const [shown, setShown] = useState<{
    current: PanelId | null;
    before: PanelId | null | undefined;
  }>({ current: expanded, before: undefined });

  if (expanded !== shown.current) {
    setShown({ current: expanded, before: shown.current });
  }

  useEffect(() => {
    const { current, before } = shown;
    if (before === undefined) return;
    if (current) {
      root.current?.querySelector<HTMLElement>(PAGE_HEADING)?.focus();
    } else if (before) {
      root.current
        ?.querySelector<HTMLElement>(`a[href="${pathOf(expandedBoard(before))}"]`)
        ?.focus();
    }
  }, [shown, root]);
}
