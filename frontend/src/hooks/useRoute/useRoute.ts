import { useRouter, useRouterState } from "@octanejs/tanstack-router";
import { isPlainClick } from "./links";
import { DEFAULT_BOARD, expandedBoard, pathOf } from "./board";
import type { BoardState, PanelId, UseRoute } from "./types";

/** The Board state the matched routes name: the Expanded panel of the page route, if any. */
function boardOf(panel: PanelId | undefined): BoardState {
  return panel ? expandedBoard(panel) : DEFAULT_BOARD;
}

/** The Board state from the URL, shared site-wide, with the ways to change the route. */
export function useRoute(): UseRoute {
  const router = useRouter();
  const panel = useRouterState({
    select: (state) => state.matches.at(-1)?.staticData.panel,
  });

  function navigate(target: BoardState) {
    // Not awaited: the router reports a failed navigation in its own state, not by rejecting.
    void router.navigate({ to: pathOf(target) });
  }

  function link(target: BoardState) {
    return {
      href: pathOf(target),
      onClick(event: MouseEvent) {
        if (!isPlainClick(event)) return;
        event.preventDefault();
        navigate(target);
      },
    };
  }

  return { board: boardOf(panel), navigate, link };
}
