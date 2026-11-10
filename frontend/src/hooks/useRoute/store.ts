import { pathOf, resolvePath } from "./routes";
import type { Route, RouteState, RouteStore } from "./types";

/**
 * The route store over the History API of `win`. It reads the URL lazily, on first use, and
 * replaces a non-canonical URL (unknown path, trailing slash) without a history entry.
 */
export function createRouteStore(win: Window = window): RouteStore {
  const listeners = new Set<() => void>();
  let state: RouteState | undefined;

  /** Reads the address bar. Back/Forward and the initial load are not user-triggered. */
  function readLocation(): RouteState {
    const { pathname, search, hash } = win.location;
    const { route, path, replace } = resolvePath(pathname);
    if (replace) win.history.replaceState(win.history.state, "", path + search + hash);
    return { route, path, userTriggered: false };
  }

  function onPopState() {
    const next = readLocation();
    // Same route (a #hash step): nothing to show again, and the earlier mark stays.
    if (state?.path === next.path) return;
    state = next;
    listeners.forEach((listener) => listener());
  }

  function getSnapshot(): RouteState {
    // With no subscriber nothing hears Back/Forward, so check the address bar instead.
    if (!state || (listeners.size === 0 && win.location.pathname !== state.path)) {
      state = readLocation();
    }
    return state;
  }

  return {
    getSnapshot,

    subscribe(listener) {
      if (listeners.size === 0) {
        getSnapshot();
        win.addEventListener("popstate", onPopState);
      }
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) win.removeEventListener("popstate", onPopState);
      };
    },

    navigate(route: Route) {
      const path = pathOf(route);
      if (getSnapshot().path === path) return;
      win.history.pushState(null, "", path);
      state = { route, path, userTriggered: true };
      listeners.forEach((listener) => listener());
    },
  };
}

/** The site's route, shared by every `useRoute()`. */
export const routeStore = createRouteStore();
