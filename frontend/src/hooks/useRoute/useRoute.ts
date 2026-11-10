import { useSyncExternalStore } from "octane";
import { isPlainClick } from "./links";
import { pathOf } from "./routes";
import { routeStore } from "./store";
import type { Route, UseRoute } from "./types";

function link(route: Route) {
  return {
    href: pathOf(route),
    onClick(event: MouseEvent) {
      if (!isPlainClick(event)) return;
      event.preventDefault();
      routeStore.navigate(route);
    },
  };
}

const navigate = (route: Route) => routeStore.navigate(route);

/** The current route, from the URL, shared site-wide, with the ways to change it. */
export function useRoute(): UseRoute {
  const { route, userTriggered } = useSyncExternalStore(
    routeStore.subscribe,
    routeStore.getSnapshot,
  );
  return { route, userTriggered, navigate, link };
}
