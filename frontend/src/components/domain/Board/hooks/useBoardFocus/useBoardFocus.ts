import { useEffect, useState } from "octane";
import { expandedBoard, pathOf } from "../../../../../hooks/useRoute";
import type { PanelId } from "../../../../../hooks/useRoute";
import type { BoardStage, RefObject } from "../../types";

/** The Panel the stage rests on (`null`: none, the Panels), or `undefined` while the Board is on its way. */
function restingPanel(stage: BoardStage): PanelId | null | undefined {
  if (stage.views === "expanded") return stage.layout;
  return stage.views === "panels" ? null : undefined;
}

/**
 * Moves focus when the Board comes to rest on another Expanded panel: opening (or switching) puts
 * it on the Expanded panel's heading, closing returns it to the Panel that was open. The first
 * render moves nothing, and neither does a stage on the way (its views are out of reach).
 */
export function useBoardFocus(stage: BoardStage, root: RefObject<HTMLElement>): void {
  const resting = restingPanel(stage);
  const [rest, setRest] = useState<{
    current: PanelId | null | undefined;
    before: PanelId | null | undefined;
  }>({ current: resting, before: undefined });

  if (resting !== undefined && resting !== rest.current) {
    setRest({ current: resting, before: rest.current });
  }

  useEffect(() => {
    const { current, before } = rest;
    if (before === undefined || current === undefined) return;
    if (current) {
      root.current?.querySelector<HTMLElement>("h1")?.focus();
    } else if (before) {
      root.current
        ?.querySelector<HTMLElement>(`a[href="${pathOf(expandedBoard(before))}"]`)
        ?.focus();
    }
  }, [rest, root]);
}
