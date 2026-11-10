import { act, fireEvent, screen, waitFor } from "@octanejs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PANEL_IDS } from "../../../../hooks/useRoute";
import { STAGE_VIEWS } from "../config";
import { FADE_PROPERTY, RESIZE_PROPERTY, SLOT_VIEWS } from "../components/Slot/config";
import { scrollToTop } from "../motion";
import { renderBoardAt } from "./helpers";

// The scroll that the browser does is replaced; a test ends a stage by firing `transitionend` the
// way the browser does, on the slots that resize or the views that fade.
vi.mock("../motion", async (original) => ({
  ...(await original<typeof import("../motion")>()),
  scrollToTop: vi.fn<() => Promise<void>>(() => Promise.resolve()),
}));

const slots = () => [...document.querySelectorAll<HTMLElement>("main li")];
const viewOf = (slot: HTMLElement) => slot.firstElementChild as HTMLElement;
const path = () => window.location.pathname;

/** The stage on screen, read from the DOM: which view stands in the slots, and whether they are faded out. */
function stage() {
  const panels = slots().every((slot) => slot.classList.contains(SLOT_VIEWS.panel));
  const hidden = slots().every((slot) => viewOf(slot).classList.contains("hidden"));
  const shown = slots().every((slot) => !viewOf(slot).classList.contains("hidden"));
  return {
    views: panels ? STAGE_VIEWS.panels : "side",
    fade: hidden ? "out" : shown ? "in" : "mixed",
    expanded: slots().findIndex((slot) => slot.classList.contains(SLOT_VIEWS.expanded)),
  };
}

function transitionEnd(target: Element, propertyName: string) {
  const event = new Event("transitionend", { bubbles: true });
  Object.defineProperty(event, "propertyName", { value: propertyName });
  fireEvent(target, event);
}

/** The views of `count` slots (all by default) end their fade. */
async function endFades(count: number = PANEL_IDS.length) {
  await act(() => {
    slots()
      .slice(0, count)
      .forEach((slot) => transitionEnd(viewOf(slot), FADE_PROPERTY));
  });
}

/** The slots end their resize. */
async function endResizes() {
  await act(() => {
    slots().forEach((slot) => transitionEnd(slot, RESIZE_PROPERTY));
  });
}

async function click(name: string) {
  await act(() => {
    fireEvent.click(screen.getByRole("link", { name }));
  });
}

/** Plays a whole sequence from the Panels to an Expanded panel: fade out, resize, fade in. */
async function playOpening() {
  await endFades();
  await endResizes();
  await endFades();
}

describe("the Board's sequence", () => {
  beforeEach(() => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.mocked(scrollToTop).mockImplementation(() => Promise.resolve());
    Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 0 });
    Reflect.deleteProperty(window, "matchMedia");
    window.history.replaceState(null, "", "/");
  });

  describe("on desktop", () => {
    it("opens a Panel in stages: Panels fade out, slots resize, Stripes and page fade in", async () => {
      await renderBoardAt("/explore");
      await click("Skills");
      expect(stage()).toEqual({ views: STAGE_VIEWS.panels, fade: "out", expanded: -1 });

      await endFades();
      expect(stage()).toEqual({ views: "side", fade: "out", expanded: 2 });
      await endResizes();
      expect(stage()).toEqual({ views: "side", fade: "in", expanded: 2 });
      await endFades();
      expect(stage()).toEqual({ views: "side", fade: "in", expanded: 2 });
    });

    it("waits for every view of a stage, not just the first to end", async () => {
      await renderBoardAt("/explore");
      await click("Skills");

      await endFades(PANEL_IDS.length - 1);
      expect(stage()).toEqual({ views: STAGE_VIEWS.panels, fade: "out", expanded: -1 });

      await act(() => {
        transitionEnd(viewOf(slots()[PANEL_IDS.length - 1] as HTMLElement), FADE_PROPERTY);
      });
      expect(stage().views).toBe("side");
    });

    it("ignores the transitions that do not belong to the stage on screen", async () => {
      await renderBoardAt("/explore");
      await click("Skills");

      // The Panels are fading out: a resize ending now is nobody's.
      await endResizes();
      expect(stage()).toEqual({ views: STAGE_VIEWS.panels, fade: "out", expanded: -1 });
    });

    it("closes a Panel in the same stages backwards", async () => {
      await renderBoardAt("/skills");
      await act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Close Skills" }));
      });

      // The page and the Stripes fade out first, in their slots.
      expect(stage()).toEqual({ views: "side", fade: "out", expanded: 2 });
      await endFades();
      expect(stage()).toEqual({ views: STAGE_VIEWS.panels, fade: "out", expanded: -1 });
      await endResizes();
      await endFades();
      expect(stage()).toEqual({ views: STAGE_VIEWS.panels, fade: "in", expanded: -1 });
    });

    it("switches in one step: no fade, only the widths animate", async () => {
      await renderBoardAt("/about");
      await click("Contact");
      expect(stage()).toEqual({ views: "side", fade: "in", expanded: 4 });
      await endResizes();
      expect(stage()).toEqual({ views: "side", fade: "in", expanded: 4 });
    });

    it("plays every stage at once with reduced motion", async () => {
      window.matchMedia = ((query: string) =>
        ({ matches: query.includes("reduce") }) as MediaQueryList) as typeof window.matchMedia;
      await renderBoardAt("/explore");
      await click("Skills");
      expect(stage()).toEqual({ views: "side", fade: "in", expanded: 2 });
    });

    it("ignores clicks while a sequence runs, and takes them again after", async () => {
      await renderBoardAt("/explore");
      await click("Skills");
      expect(path()).toBe("/skills");

      await click("About");
      expect(path()).toBe("/skills");
      expect(stage().fade).toBe("out");

      await playOpening();
      await click("About");
      await waitFor(() => expect(path()).toBe("/about"));
    });

    it("lets a modified click on a link through while a sequence runs", async () => {
      await renderBoardAt("/explore");
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
      await click("Skills");
      await endFades();
      expect(stage().expanded).toBe(2);

      await act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Close Skills" }));
        fireEvent.keyDown(document, { key: "Escape" });
      });
      expect(path()).toBe("/skills");

      await endResizes();
      await endFades();
      await act(() => {
        fireEvent.keyDown(document, { key: "Escape" });
      });
      await waitFor(() => expect(path()).toBe("/explore"));
    });

    it("drops the stages still to play on Back and goes on from the stage on screen", async () => {
      await renderBoardAt("/explore");
      await click("Skills");
      expect(stage()).toEqual({ views: STAGE_VIEWS.panels, fade: "out", expanded: -1 });

      await act(async () => {
        window.history.back();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      await waitFor(() => expect(path()).toBe("/explore"));
      // The Panels were only fading out: they fade straight back in.
      expect(stage()).toEqual({ views: STAGE_VIEWS.panels, fade: "in", expanded: -1 });
      await endFades();
    });

    it("goes back through the stages it has played, from the middle", async () => {
      await renderBoardAt("/explore");
      await click("Skills");
      await endFades();
      expect(stage()).toEqual({ views: "side", fade: "out", expanded: 2 });

      await act(async () => {
        window.history.back();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      await waitFor(() => expect(path()).toBe("/explore"));
      // Back from the resized slots: the slots turn even first, the Panels fade in last.
      expect(stage()).toEqual({ views: STAGE_VIEWS.panels, fade: "out", expanded: -1 });
      await endResizes();
      expect(stage()).toEqual({ views: STAGE_VIEWS.panels, fade: "in", expanded: -1 });
    });

    it("plays Back like any other change", async () => {
      await renderBoardAt("/explore");
      await click("Skills");
      await playOpening();
      expect(stage().fade).toBe("in");

      await act(async () => {
        window.history.back();
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
      await waitFor(() => expect(path()).toBe("/explore"));
      expect(stage()).toEqual({ views: "side", fade: "out", expanded: 2 });
    });
  });

  describe("switching from a scrolled page", () => {
    it("scrolls to the top first, and changes the Panels when the scroll ends", async () => {
      await renderBoardAt("/about");
      Object.defineProperty(window, "scrollY", { configurable: true, value: 300 });
      const scroll = { arrive: () => {} };
      vi.mocked(scrollToTop).mockImplementation(
        () => new Promise<void>((resolve) => (scroll.arrive = resolve)),
      );

      await click("Contact");
      expect(scrollToTop).toHaveBeenCalledTimes(1);
      // Nothing has moved yet, the route is still About's, and clicks are ignored meanwhile.
      expect(path()).toBe("/about");
      expect(stage()).toEqual({ views: "side", fade: "in", expanded: 0 });
      await click("Skills");
      expect(path()).toBe("/about");

      await act(async () => scroll.arrive());
      await waitFor(() => expect(path()).toBe("/contact"));
      await waitFor(() => expect(stage()).toEqual({ views: "side", fade: "in", expanded: 4 }));
    });

    it("takes clicks again once the switch has gone through", async () => {
      await renderBoardAt("/about");
      Object.defineProperty(window, "scrollY", { configurable: true, value: 300 });
      await click("Contact");
      await waitFor(() => expect(path()).toBe("/contact"));
      await endResizes();
      await click("About");
      await waitFor(() => expect(path()).toBe("/about"));
    });

    it("does not scroll from the top", async () => {
      await renderBoardAt("/about");
      await click("Contact");
      expect(scrollToTop).not.toHaveBeenCalled();
    });

    it("leaves a modified click alone", async () => {
      await renderBoardAt("/about");
      Object.defineProperty(window, "scrollY", { configurable: true, value: 300 });
      fireEvent.click(screen.getByRole("link", { name: "Contact" }), { ctrlKey: true });
      expect(scrollToTop).not.toHaveBeenCalled();
    });

    it("does not scroll to close", async () => {
      await renderBoardAt("/about");
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
      await click("Skills");

      expect(stage()).toEqual({ views: "side", fade: "in", expanded: 2 });
      await endResizes();
      expect(stage()).toEqual({ views: "side", fade: "in", expanded: 2 });
    });

    it("keeps clicks off while the one step runs", async () => {
      await renderBoardAt("/explore");
      await click("Skills");
      await click("About");
      expect(path()).toBe("/skills");
      await endResizes();
      await click("About");
      await waitFor(() => expect(path()).toBe("/about"));
    });

    it("switches in one step, after scrolling to the top", async () => {
      await renderBoardAt("/about");
      Object.defineProperty(window, "scrollY", { configurable: true, value: 300 });
      await click("Contact");
      expect(scrollToTop).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(stage()).toEqual({ views: "side", fade: "in", expanded: 4 }));
    });
  });
});
