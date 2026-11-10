import { act, renderHook } from "@octanejs/testing-library";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_BOARD, expandedBoard, routerWrapper, testRouter, useRoute } from "..";

const about = expandedBoard("about");

/** A router at `path`, loaded, with a `useRoute()` under it. */
async function hookAt(path: string) {
  window.history.replaceState(null, "", path);
  const router = testRouter();
  await router.load();
  return { router, ...renderHook(() => useRoute(), { wrapper: routerWrapper(undefined, router) }) };
}

describe("useRoute", () => {
  beforeEach(() => window.history.replaceState(null, "", "/"));
  afterEach(() => window.history.replaceState(null, "", "/"));

  it.each([
    ["/", DEFAULT_BOARD],
    ["/explore", DEFAULT_BOARD],
    ["/about", { kind: "expanded", panel: "about" }],
    ["/what-i-do", { kind: "expanded", panel: "whatIDo" }],
    ["/skills", { kind: "expanded", panel: "skills" }],
    ["/chat", { kind: "expanded", panel: "chatWithMe" }],
    ["/contact", { kind: "expanded", panel: "contact" }],
  ])("reads the Board state of %s from the matched route", async (path, expected) => {
    const { result } = await hookAt(path);
    expect(result.current.board).toEqual(expected);
  });

  it("follows navigate(), as a new history entry", async () => {
    const { result } = await hookAt("/");
    const entries = window.history.length;
    await act(() => result.current.navigate(DEFAULT_BOARD));
    expect(result.current.board).toEqual(DEFAULT_BOARD);
    expect(window.location.pathname).toBe("/explore");
    expect(window.history.length).toBe(entries + 1);
  });

  describe("link()", () => {
    it("gives the real URL for the browser's own handling", async () => {
      const { result } = await hookAt("/");
      expect(result.current.link(about).href).toBe("/about");
    });

    it("handles a plain click in the app, without a reload", async () => {
      const { result } = await hookAt("/");
      const event = new MouseEvent("click", { button: 0, cancelable: true });
      await act(() => result.current.link(about).onClick(event));
      expect(event.defaultPrevented).toBe(true);
      expect(window.location.pathname).toBe("/about");
      expect(result.current.board).toEqual(about);
    });

    it("leaves a modified click to the browser (new tab)", async () => {
      const { result } = await hookAt("/");
      const event = new MouseEvent("click", { button: 0, ctrlKey: true, cancelable: true });
      await act(() => result.current.link(about).onClick(event));
      expect(event.defaultPrevented).toBe(false);
      expect(window.location.pathname).toBe("/");
    });
  });
});
