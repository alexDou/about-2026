import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRouteStore } from "../store";

const board = { screen: "board", board: { kind: "default" } } as const;
const landing = { screen: "landing" } as const;

/** Starts a test at `path` as if the visitor had just loaded it. */
function visit(path: string) {
  window.history.replaceState(null, "", path);
}

/** Resolves when the browser has finished a Back/Forward traversal. */
const popped = () =>
  new Promise<void>((done) => window.addEventListener("popstate", () => done(), { once: true }));

describe("createRouteStore", () => {
  beforeEach(() => visit("/"));
  afterEach(() => visit("/"));

  describe("on load", () => {
    it("shows the Board for a direct visit to /explore, not user-triggered", () => {
      visit("/explore");
      expect(createRouteStore().getSnapshot()).toEqual({
        route: board,
        path: "/explore",
        userTriggered: false,
      });
    });

    it("replaces an unknown path by / without a history entry", () => {
      visit("/nope");
      const entries = window.history.length;
      const store = createRouteStore();
      expect(store.getSnapshot().route).toEqual(landing);
      expect(window.location.pathname).toBe("/");
      expect(window.history.length).toBe(entries);
    });

    it("replaces /explore/ by /explore without a history entry", () => {
      visit("/explore/");
      const entries = window.history.length;
      const store = createRouteStore();
      expect(store.getSnapshot().route).toEqual(board);
      expect(window.location.pathname).toBe("/explore");
      expect(window.history.length).toBe(entries);
    });

    it("keeps the query and hash of a corrected URL", () => {
      visit("/explore/?a=1#b");
      createRouteStore().getSnapshot();
      expect(window.location.pathname + window.location.search + window.location.hash).toBe(
        "/explore?a=1#b",
      );
    });
  });

  describe("while nobody is subscribed", () => {
    it("still shows the URL the browser is at, not a stale one", () => {
      const store = createRouteStore();
      expect(store.getSnapshot().route).toEqual(landing);
      visit("/explore");
      window.dispatchEvent(new PopStateEvent("popstate"));
      expect(store.getSnapshot()).toEqual({ route: board, path: "/explore", userTriggered: false });
    });
  });

  describe("a Back/Forward that leaves the path as it was (a #hash step)", () => {
    it("keeps the snapshot, including its user-triggered mark, and tells nobody", () => {
      const store = createRouteStore();
      store.subscribe(() => {});
      store.navigate(board);
      const before = store.getSnapshot();
      const listener = vi.fn<() => void>();
      store.subscribe(listener);
      window.history.replaceState(null, "", "/explore#section");
      window.dispatchEvent(new PopStateEvent("popstate"));
      expect(store.getSnapshot()).toBe(before);
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("navigate", () => {
    it("adds a history entry, shows the route and marks the change user-triggered", () => {
      const store = createRouteStore();
      const entries = window.history.length;
      store.navigate(board);
      expect(window.location.pathname).toBe("/explore");
      expect(window.history.length).toBe(entries + 1);
      expect(store.getSnapshot()).toEqual({ route: board, path: "/explore", userTriggered: true });
    });

    it("does nothing when the route is already shown", () => {
      const store = createRouteStore();
      const before = store.getSnapshot();
      const entries = window.history.length;
      const listener = vi.fn<() => void>();
      store.subscribe(listener);
      store.navigate(landing);
      expect(window.history.length).toBe(entries);
      expect(store.getSnapshot()).toBe(before);
      expect(listener).not.toHaveBeenCalled();
    });

    it("tells subscribers, until they unsubscribe", () => {
      const store = createRouteStore();
      const listener = vi.fn<() => void>();
      const unsubscribe = store.subscribe(listener);
      store.navigate(board);
      expect(listener).toHaveBeenCalledTimes(1);
      unsubscribe();
      store.navigate(landing);
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe("Back and Forward", () => {
    it("returns to the Landing on Back and to the Board on Forward, neither user-triggered", async () => {
      const store = createRouteStore();
      const stop = store.subscribe(() => {});
      store.navigate(board);

      let traversal = popped();
      window.history.back();
      await traversal;
      expect(store.getSnapshot()).toEqual({ route: landing, path: "/", userTriggered: false });

      traversal = popped();
      window.history.forward();
      await traversal;
      expect(store.getSnapshot()).toEqual({ route: board, path: "/explore", userTriggered: false });
      stop();
    });

    it("stops listening to the window with its last subscriber", () => {
      const remove = vi.spyOn(window, "removeEventListener");
      const store = createRouteStore();
      store.subscribe(() => {})();
      expect(remove).toHaveBeenCalledWith("popstate", expect.any(Function));
      remove.mockRestore();
    });
  });
});
