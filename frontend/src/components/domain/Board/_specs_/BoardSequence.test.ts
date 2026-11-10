import { act, fireEvent, screen, waitFor } from "@octanejs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { scrollToTop } from "../hooks/useBoardSequence/probes";
import { renderBoardAt } from "./helpers";

// Real timers and real transitions are out of the picture: the probes that read the browser are
// replaced, and a test ends a stage by firing `transitionend` itself.
vi.mock("../hooks/useBoardSequence/probes", async (original) => ({
  ...(await original<typeof import("../hooks/useBoardSequence/probes")>()),
  scrollToTop: vi.fn<() => Promise<void>>(() => Promise.resolve()),
}));

/**
 * The browser's transitions, faked: a stage runs `PER_STAGE` of them from the moment the DOM
 * differs from how it looked when the last stage ended, and `left` overrides how many are left.
 * `null`: nothing ever runs, as with reduced motion.
 */
const PER_STAGE = 2;
let ended: string | null = null;
let left: number | null = null;

const slots = () => [...document.querySelectorAll<HTMLElement>("main li")];
const viewOf = (slot: HTMLElement) => slot.firstElementChild as HTMLElement;
const board = () => document.querySelector("main") as HTMLElement;
const path = () => window.location.pathname;
const look = () =>
  slots()
    .map((slot) => `${slot.className}|${viewOf(slot).className}`)
    .join(";");

/** From now on every stage runs transitions. */
function animate() {
  ended = look();
}

/** The stage on screen, read from the DOM: which view stands in the slots, and whether they are faded out. */
function stage() {
  const panels = slots().every((slot) => slot.classList.contains("panel"));
  const hidden = slots().every((slot) => viewOf(slot).classList.contains("hidden"));
  const shown = slots().every((slot) => !viewOf(slot).classList.contains("hidden"));
  return {
    views: panels ? "panels" : "side",
    fade: hidden ? "out" : shown ? "in" : "mixed",
    expanded: slots().findIndex((slot) => slot.classList.contains("expanded")),
  };
}

/** The transitions of the stage on screen end. */
async function endStage() {
  ended = look();
  left = null;
  await act(() => {
    fireEvent.transitionEnd(board());
  });
}

/** Ends stages until the sequence rests; `limit` stops a sequence that never does. */
async function endAllStages(limit = 6) {
  for (let i = 0; i < limit; i++) await endStage();
}

async function click(name: string) {
  await act(() => {
    fireEvent.click(screen.getByRole("link", { name }));
  });
}

describe("the Board's sequence", () => {
  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    ended = null;
    left = null;
    Object.defineProperty(HTMLElement.prototype, "getAnimations", {
      configurable: true,
      value: () =>
        ended === null || look() === ended
          ? []
          : Array.from({ length: left ?? PER_STAGE }, () => ({
              transitionProperty: "opacity",
              playState: "running",
              effect: { target: document.querySelector("[data-seq]") },
            })),
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.mocked(scrollToTop).mockImplementation(() => Promise.resolve());
    Reflect.deleteProperty(HTMLElement.prototype, "getAnimations");
    Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 0 });
    Reflect.deleteProperty(window, "matchMedia");
    window.history.replaceState(null, "", "/");
  });

  describe("on desktop", () => {
    it("opens a Panel in stages: Panels fade out, slots resize, Stripes and page fade in", async () => {
      await renderBoardAt("/explore");
      animate();
      await click("Skills");
      expect(stage()).toEqual({ views: "panels", fade: "out", expanded: -1 });

      await endStage();
      expect(stage()).toEqual({ views: "side", fade: "out", expanded: 2 });
      await endStage();
      expect(stage()).toEqual({ views: "side", fade: "in", expanded: 2 });
      await endStage();
      expect(stage()).toEqual({ views: "side", fade: "in", expanded: 2 });
    });

    it("waits for every running transition of a stage, not just the first to end", async () => {
      await renderBoardAt("/explore");
      animate();
      await click("Skills");

      left = 1;
      await act(() => {
        fireEvent.transitionEnd(board());
      });
      expect(stage()).toEqual({ views: "panels", fade: "out", expanded: -1 });

      left = null;
      await endStage();
      expect(stage().views).toBe("side");
    });

    it("counts a cancelled transition as ended", async () => {
      await renderBoardAt("/explore");
      animate();
      await click("Skills");

      ended = look();
      await act(() => {
        fireEvent(board(), new Event("transitioncancel", { bubbles: true }));
      });
      expect(stage().views).toBe("side");
    });

    it("closes in stages, the same steps backwards", async () => {
      await renderBoardAt("/skills");
      animate();
      await act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Close Skills" }));
      });

      // The page and the Stripes fade out first, in their slots.
      expect(stage()).toEqual({ views: "side", fade: "out", expanded: 2 });
      await endStage();
      expect(stage()).toEqual({ views: "panels", fade: "out", expanded: -1 });
      await endStage();
      expect(stage()).toEqual({ views: "panels", fade: "in", expanded: -1 });
    });

    it("switches in one step: no fade, only the widths animate", async () => {
      await renderBoardAt("/about");
      animate();
      await click("Contact");
      expect(stage()).toEqual({ views: "side", fade: "in", expanded: 4 });
      await endStage();
      expect(stage()).toEqual({ views: "side", fade: "in", expanded: 4 });
    });

    it("plays every stage at once where nothing runs, as with reduced motion", async () => {
      await renderBoardAt("/explore");
      await click("Skills");
      await waitFor(() => expect(stage()).toEqual({ views: "side", fade: "in", expanded: 2 }));
    });

    it("ignores clicks while a sequence runs, and takes them again after", async () => {
      await renderBoardAt("/explore");
      animate();
      await click("Skills");
      expect(path()).toBe("/skills");

      await click("About");
      expect(path()).toBe("/skills");
      expect(stage().fade).toBe("out");

      await endAllStages();
      await click("About");
      await waitFor(() => expect(path()).toBe("/about"));
    });

    it("lets a modified click on a link through while a sequence runs", async () => {
      await renderBoardAt("/explore");
      animate();
      await click("Skills");
      let handled = true;
      document.addEventListener(
        "click",
        (event) => {
          handled = event.defaultPrevented;
          event.preventDefault();
        },
        { once: true },
      );
      fireEvent.click(screen.getByRole("link", { name: "About" }), { ctrlKey: true });
      expect(handled).toBe(false);
    });

    it("ignores the close button and Escape while a sequence runs", async () => {
      await renderBoardAt("/explore");
      animate();
      await click("Skills");
      await endStage();
      expect(stage().expanded).toBe(2);

      await act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Close Skills" }));
        fireEvent.keyDown(document, { key: "Escape" });
      });
      expect(path()).toBe("/skills");

      await endAllStages();
      await act(() => {
        fireEvent.keyDown(document, { key: "Escape" });
      });
      await waitFor(() => expect(path()).toBe("/explore"));
    });

    it("drops the stages still to play on Back and goes on from the stage on screen", async () => {
      await renderBoardAt("/explore");
      animate();
      await click("Skills");
      expect(stage()).toEqual({ views: "panels", fade: "out", expanded: -1 });

      await act(async () => {
        window.history.back();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      await waitFor(() => expect(path()).toBe("/explore"));
      // The Panels were only fading out: they fade straight back in.
      expect(stage()).toEqual({ views: "panels", fade: "in", expanded: -1 });
      await endStage();
    });

    it("ignores the end of a dropped stage", async () => {
      await renderBoardAt("/explore");
      animate();
      await click("Skills");
      await endStage();
      expect(stage()).toEqual({ views: "side", fade: "out", expanded: 2 });

      await act(async () => {
        window.history.back();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      await waitFor(() => expect(path()).toBe("/explore"));
      // Back from the resized slots: the slots turn even first, the Panels fade in last.
      expect(stage()).toEqual({ views: "panels", fade: "out", expanded: -1 });
      await endStage();
      expect(stage()).toEqual({ views: "panels", fade: "in", expanded: -1 });
    });

    it("plays Back like any other change", async () => {
      await renderBoardAt("/explore");
      await click("Skills");
      await waitFor(() => expect(stage().fade).toBe("in"));

      animate();
      await act(async () => {
        window.history.back();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      await waitFor(() => expect(path()).toBe("/explore"));
      expect(stage()).toEqual({ views: "side", fade: "out", expanded: 2 });
    });
  });

  describe("switching from a scrolled page", () => {
    it("scrolls to the top first, and switches when the scroll ends", async () => {
      await renderBoardAt("/about");
      animate();
      Object.defineProperty(window, "scrollY", { configurable: true, value: 300 });
      const scroll = { arrive: () => {} };
      vi.mocked(scrollToTop).mockImplementation(
        () => new Promise<void>((resolve) => (scroll.arrive = resolve)),
      );

      await click("Contact");
      expect(scrollToTop).toHaveBeenCalledTimes(1);
      // Nothing has moved yet, and clicks are ignored meanwhile.
      expect(stage()).toEqual({ views: "side", fade: "in", expanded: 0 });
      await click("Skills");
      expect(path()).toBe("/contact");

      await act(async () => scroll.arrive());
      expect(stage()).toEqual({ views: "side", fade: "in", expanded: 4 });
    });

    it("does not scroll from the top", async () => {
      await renderBoardAt("/about");
      animate();
      await click("Contact");
      expect(scrollToTop).not.toHaveBeenCalled();
    });

    it("does not scroll to close", async () => {
      await renderBoardAt("/about");
      animate();
      Object.defineProperty(window, "scrollY", { configurable: true, value: 300 });
      await act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Close About" }));
      });
      expect(scrollToTop).not.toHaveBeenCalled();
    });
  });

  describe("on mobile", () => {
    beforeEach(() => {
      window.matchMedia = ((query: string) =>
        ({ matches: query.includes("840px") }) as MediaQueryList) as typeof window.matchMedia;
    });

    it("opens in one step: no fade-out, the rows shrink and the chosen one expands", async () => {
      await renderBoardAt("/explore");
      animate();
      await click("Skills");

      expect(stage()).toEqual({ views: "side", fade: "in", expanded: 2 });
      await endStage();
      expect(stage()).toEqual({ views: "side", fade: "in", expanded: 2 });
    });

    it("keeps clicks off while the one step runs", async () => {
      await renderBoardAt("/explore");
      animate();
      await click("Skills");
      await click("About");
      expect(path()).toBe("/skills");
    });

    it("switches in one step, after scrolling to the top", async () => {
      await renderBoardAt("/about");
      animate();
      Object.defineProperty(window, "scrollY", { configurable: true, value: 300 });
      await click("Contact");
      expect(scrollToTop).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(stage()).toEqual({ views: "side", fade: "in", expanded: 4 }));
    });
  });
});
