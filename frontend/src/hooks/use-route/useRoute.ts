import { useRouter, useRouterState } from "@octanejs/tanstack-router";
import { isPlainClick } from "./links";
import { DEFAULT_EXPLORE, expandedExplore, pathOf } from "./explore";
import type { ExploreState, PanelId, UseRoute } from "./types";

/** Explore state the matched routes name: the Expanded panel of the page route, if any. */
function exploreOf(panel: PanelId | undefined): ExploreState {
  return panel ? expandedExplore(panel) : DEFAULT_EXPLORE;
}

/** Explore state from the URL, shared site-wide, with the ways to change the route. */
export function useRoute(): UseRoute {
  const router = useRouter();
  const panel = useRouterState({
    select: (state) => state.matches.at(-1)?.staticData.panel,
  });

  function navigate(target: ExploreState) {
    // Not awaited: the router reports a failed navigation in its own state, not by rejecting.
    void router.navigate({ to: pathOf(target) });
  }

  function link(target: ExploreState) {
    return {
      href: pathOf(target),
      onClick(event: MouseEvent) {
        if (!isPlainClick(event)) return;
        event.preventDefault();
        navigate(target);
      },
    };
  }

  return { explore: exploreOf(panel), navigate, link };
}
