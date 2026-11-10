import { useEffect, useState } from "octane";
import { expandedBoard, pathOf } from "../../../../../hooks/useRoute";
import type { PanelId } from "../../../../../hooks/useRoute";
import { STAGE_VIEWS } from "../../config";
import type { BoardStage, RefObject } from "../../types";
import { PAGE_HEADING } from "./config";

/** The Panel the stage rests on (`null`: none, the Panels), or `undefined` while the Board is on its way. */
function restingPanel(stage: BoardStage): PanelId | null | undefined {
  if (stage.views === STAGE_VIEWS.expanded) return stage.layout;
  return stage.views === STAGE_VIEWS.panels ? null : undefined;
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
      root.current?.querySelector<HTMLElement>(PAGE_HEADING)?.focus();
    } else if (before) {
      root.current
        ?.querySelector<HTMLElement>(`a[href="${pathOf(expandedBoard(before))}"]`)
        ?.focus();
    }
  }, [rest, root]);
}
