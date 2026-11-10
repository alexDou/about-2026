import { act, renderHook } from "@octanejs/testing-library";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useRoute } from "..";

/** Puts the address bar at `path` and tells the hook, as Back/Forward does. */
function arriveAt(path: string) {
  act(() => {
    window.history.replaceState(null, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
}

describe("useRoute", () => {
  beforeEach(() => arriveAt("/"));
  afterEach(() => arriveAt("/"));

  it("reads the route from the URL", () => {
    arriveAt("/skills");
    const { result } = renderHook(() => useRoute());
    expect(result.current.route).toEqual({
      screen: "board",
      board: { kind: "expanded", panel: "skills" },
    });
  });

  it("shares one route between every user of the hook", () => {
    const first = renderHook(() => useRoute());
    const second = renderHook(() => useRoute());
    act(() => first.result.current.navigate({ screen: "board", board: { kind: "default" } }));
    expect(second.result.current.route).toEqual({ screen: "board", board: { kind: "default" } });
  });

  it("marks a navigate() as user-triggered and the next Back/Forward as not", () => {
    const { result } = renderHook(() => useRoute());
    expect(result.current.userTriggered).toBe(false);
    act(() => result.current.navigate({ screen: "board", board: { kind: "default" } }));
    expect(result.current.userTriggered).toBe(true);
    arriveAt("/");
    expect(result.current.userTriggered).toBe(false);
    expect(result.current.route).toEqual({ screen: "landing" });
  });

  describe("link()", () => {
    const aboutRoute = {
      screen: "board",
      board: { kind: "expanded", panel: "about" },
    } as const;

    it("gives the real URL for the browser's own handling", () => {
      const { result } = renderHook(() => useRoute());
      expect(result.current.link(aboutRoute).href).toBe("/about");
    });

    it("handles a plain click in the app, without a reload", () => {
      const { result } = renderHook(() => useRoute());
      const event = new MouseEvent("click", { button: 0, cancelable: true });
      act(() => result.current.link(aboutRoute).onClick(event));
      expect(event.defaultPrevented).toBe(true);
      expect(window.location.pathname).toBe("/about");
      expect(result.current.userTriggered).toBe(true);
    });

    it("leaves a modified click to the browser (new tab)", () => {
      const { result } = renderHook(() => useRoute());
      const event = new MouseEvent("click", { button: 0, ctrlKey: true, cancelable: true });
      act(() => result.current.link(aboutRoute).onClick(event));
      expect(event.defaultPrevented).toBe(false);
      expect(window.location.pathname).toBe("/");
    });
  });
});
