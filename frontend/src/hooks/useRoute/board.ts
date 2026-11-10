import { BOARD_KIND, BOARD_PATH, PANEL_IDS, PANEL_PATHS } from "./config";
import type { BoardState, PanelId, RoutePath } from "./types";

/** The URL that shows `board`. */
export function pathOf(board: BoardState): RoutePath {
  return board.kind === BOARD_KIND.default ? BOARD_PATH : PANEL_PATHS[board.panel];
}

/** The Board with no Panel open: where the Landing's logo leads. */
export const DEFAULT_BOARD: BoardState = { kind: BOARD_KIND.default };

const EXPANDED_BOARDS = Object.fromEntries(
  PANEL_IDS.map((panel) => [panel, { kind: BOARD_KIND.expanded, panel }]),
) as Record<PanelId, BoardState>;

/** The Board with `panel` as the Expanded panel. One object per Panel, so a Board can be compared by identity. */
export function expandedBoard(panel: PanelId): BoardState {
  return EXPANDED_BOARDS[panel];
}
