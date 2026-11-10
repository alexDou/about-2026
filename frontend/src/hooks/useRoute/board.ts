import { BOARD_PATH, PANEL_PATHS } from "./config";
import type { BoardState, PanelId, RoutePath } from "./types";

/** The URL that shows `board`. */
export function pathOf(board: BoardState): RoutePath {
  return board.kind === "default" ? BOARD_PATH : PANEL_PATHS[board.panel];
}

/** The Board with no Panel open: where the Landing's logo leads. */
export const DEFAULT_BOARD: BoardState = { kind: "default" };

/** The Board with `panel` as the Expanded panel. */
export function expandedBoard(panel: PanelId): BoardState {
  return { kind: "expanded", panel };
}
