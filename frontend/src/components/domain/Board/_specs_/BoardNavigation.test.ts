import { act, fireEvent, screen, waitFor } from "@octanejs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SLOT_VIEWS } from "../components/Slot/config";
import { scrollToTop } from "../motion";
import { renderBoardAt } from "./helpers";

// The scroll that the browser does is replaced. The Board shows the route at once; the browser's
// View Transition plays the change, which jsdom does not have.
vi.mock("../motion", async (original) => ({
  ...(await original<typeof import("../motion")>()),
  scrollToTop: vi.fn<() => Promise<void>>(() => Promise.resolve()),
}));

const slots = () => [...document.querySelectorAll<HTMLElement>("main li")];
const path = () => window.location.pathname;

/** What the Board shows, read from the DOM: the slot of the Expanded panel, `-1` for the five Panels. */
const expanded = () =>
  slots().findIndex((slot) => slot.classList.contains(`slot--${SLOT_VIEWS.expanded}`));

async function click(name: string) {
  await act(() => {
    fireEvent.click(screen.getByRole("link", { name }));
  });
}

describe("the Board on a change of route", () => {
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
    it("switches to the other Panel at once", async () => {
      await renderBoardAt("/about");
      await click("Contact");
      expect(expanded()).toBe(4);
    });

    it("opens a Panel at once with reduced motion", async () => {
      window.matchMedia = ((query: string) =>
        ({ matches: query.includes("reduce") }) as MediaQueryList) as typeof window.matchMedia;
      await renderBoardAt("/explore");
      await click("Skills");
      expect(expanded()).toBe(2);
    });

    it("lets a modified click on a link through", async () => {
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
      expect(expanded()).toBe(0);
      await click("Skills");
      expect(path()).toBe("/about");

      await act(async () => scroll.arrive());
      await waitFor(() => expect(path()).toBe("/contact"));
      await waitFor(() => expect(expanded()).toBe(4));
    });

    it("takes clicks again once the switch has gone through", async () => {
      await renderBoardAt("/about");
      Object.defineProperty(window, "scrollY", { configurable: true, value: 300 });
      await click("Contact");
      await waitFor(() => expect(path()).toBe("/contact"));
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
});
