import { afterEach, describe, expect, it, vi } from "vitest";
import { isMobile, runningTransitions, scrollToTop } from "../probes";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 0 });
  Reflect.deleteProperty(window, "matchMedia");
});

describe("isMobile", () => {
  it("is false without media queries", () => {
    expect(isMobile()).toBe(false);
  });

  it("follows the phone layout's media query", () => {
    window.matchMedia = vi.fn<(query: string) => { matches: boolean }>((query) => ({
      matches: query === "(width < 840px)",
    })) as unknown as typeof window.matchMedia;
    expect(isMobile()).toBe(true);
  });
});

const transition = (target: Element, playState = "running") => ({
  transitionProperty: "opacity",
  playState,
  effect: { target },
});

function rootWith(animations: object[]) {
  const root = document.createElement("div");
  root.getAnimations = (() => animations) as unknown as typeof root.getAnimations;
  return root;
}

describe("runningTransitions", () => {
  it("counts zero without the Web Animations API, or without a root", () => {
    expect(runningTransitions(document.createElement("div"))).toBe(0);
    expect(runningTransitions(null)).toBe(0);
  });

  it("counts the transitions of the elements that carry the sequence attribute", () => {
    const slot = document.createElement("li");
    slot.setAttribute("data-seq", "");
    const other = document.createElement("a");
    expect(
      runningTransitions(rootWith([transition(slot), transition(slot), transition(other)])),
    ).toBe(2);
  });

  it("leaves out finished transitions and animations that are not transitions", () => {
    const slot = document.createElement("li");
    slot.setAttribute("data-seq", "");
    expect(
      runningTransitions(
        rootWith([
          transition(slot, "finished"),
          { playState: "running", effect: { target: slot } },
        ]),
      ),
    ).toBe(0);
  });
});

const scrolledBy = (y: number) =>
  Object.defineProperty(window, "scrollY", { configurable: true, value: y });

describe("scrollToTop", () => {
  it("resolves at once at the top, without scrolling", async () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    await scrollToTop();
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("scrolls smoothly and resolves when the page stops moving", async () => {
    scrolledBy(300);
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
      frames.push(callback),
    );
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const scroll = { done: false };
    const promise = scrollToTop().then(() => (scroll.done = true));
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });

    // The page keeps moving: not over.
    for (let i = 0; i < 20; i++) {
      scrolledBy(300 - i * 10);
      frames.shift()?.(0);
      await Promise.resolve();
    }
    expect(scroll.done).toBe(false);

    // It stands still for a few frames: over, though it is not at the top.
    for (let i = 0; i < 10; i++) {
      frames.shift()?.(0);
      await Promise.resolve();
    }
    await promise;
    expect(scroll.done).toBe(true);
  });

  it("resolves when the page reaches the top", async () => {
    scrolledBy(300);
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
      frames.push(callback),
    );
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const promise = scrollToTop();
    scrolledBy(0);
    frames.shift()?.(0);
    await expect(promise).resolves.toBeUndefined();
  });

  it("stops waiting when its signal aborts", async () => {
    scrolledBy(300);
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
      frames.push(callback),
    );
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const waiting = new AbortController();
    const promise = scrollToTop(waiting.signal);
    scrolledBy(250);
    waiting.abort();
    frames.shift()?.(0);
    await promise;
    expect(frames).toHaveLength(0);
  });

  it("scrolls at once under reduced motion", async () => {
    scrolledBy(300);
    window.matchMedia = vi.fn<() => { matches: boolean }>(() => ({
      matches: true,
    })) as unknown as typeof window.matchMedia;
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    await scrollToTop();
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
  });
});
