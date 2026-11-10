import { act, fireEvent, render, screen, waitFor } from "@octanejs/testing-library";
import { createElement } from "octane";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { intlWrapper } from "../../../../i18n";
import { PANEL_IDS, RouterProvider, testRouter } from "../../../../hooks/useRoute";
import { Board } from ".././Board.tsrx";

const page = () => createElement("p", null, "The page");
const pages = Object.fromEntries(PANEL_IDS.map((panel) => [panel, page]));

/** Shows the Board at `path`, as the site does: the route's page in the Board's `Outlet`. */
async function renderBoardAt(path: string, messages?: Parameters<typeof intlWrapper>[0]) {
  window.history.replaceState(null, "", path);
  const router = testRouter({ board: Board, pages });
  const view = render(RouterProvider, { props: { router }, wrapper: intlWrapper(messages) });
  await act(() => router.load());
  return view;
}

/** Clicks `target`; reports whether the app took the click, and stops jsdom "following" the link. */
function clickHandledByApp(target: HTMLElement, init: MouseEventInit = {}): boolean {
  let handled = false;
  const observe = (event: Event) => {
    handled = event.defaultPrevented;
    event.preventDefault();
  };
  document.addEventListener("click", observe, { once: true });
  fireEvent.click(target, init);
  return handled;
}

const themeColor = () =>
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.content;

describe("Board", () => {
  // The router scrolls to the top on every navigation; jsdom has no scrolling.
  beforeEach(() => vi.spyOn(window, "scrollTo").mockImplementation(() => {}));
  afterEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState(null, "", "/");
  });

  describe("with no Panel open", () => {
    it("lists the five Panel titles in order as links to their URLs", async () => {
      await renderBoardAt("/explore");
      const links = screen.getAllByRole("link");
      expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
        ["About", "/about"],
        ["What I do", "/what-i-do"],
        ["Skills", "/skills"],
        ["Chat with me", "/chat"],
        ["Contact", "/contact"],
      ]);
    });

    it("gives each Panel its tone by position", async () => {
      await renderBoardAt("/explore");
      const items = screen.getAllByRole("listitem");
      ["ink", "mist", "teal", "blue", "green"].forEach((tone, i) =>
        expect(items[i]).toHaveClass(tone),
      );
    });

    it("shows Sublabels on What I do and Chat with me only", async () => {
      await renderBoardAt("/explore");
      const items = screen.getAllByRole("listitem").map((item) => item.textContent);
      expect(items).toEqual([
        "About",
        "What I do36 Takeovers",
        "Skills",
        "Chat with meAI agent trained on my data",
        "Contact",
      ]);
    });

    it("takes the titles from the messages", async () => {
      await renderBoardAt("/explore", { "board.panel.about.title": "Über mich" });
      expect(screen.getByRole("link", { name: "Über mich" })).toHaveAttribute("href", "/about");
    });

    it("handles a plain click in the app, without a reload", async () => {
      await renderBoardAt("/explore");
      expect(clickHandledByApp(screen.getByRole("link", { name: "Skills" }))).toBe(true);
      await waitFor(() => expect(window.location.pathname).toBe("/skills"));
    });

    it.each([
      ["Ctrl", { ctrlKey: true }],
      ["Meta", { metaKey: true }],
      ["middle", { button: 1 }],
    ])("leaves a %s click to the browser", async (_name, init) => {
      await renderBoardAt("/explore");
      expect(clickHandledByApp(screen.getByRole("link", { name: "Skills" }), init)).toBe(false);
    });

    it("has no close button", async () => {
      await renderBoardAt("/explore");
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("with a Panel open", () => {
    it("shows the page in the Expanded panel and the other four Panels as Stripes, in order", async () => {
      await renderBoardAt("/skills");
      const items = screen.getAllByRole("listitem");
      expect(items.map((item) => item.textContent?.trim())).toEqual([
        "About",
        "What I do",
        "The page",
        "Chat with me",
        "Contact",
      ]);
      expect(items[2]).toHaveClass("expanded", "teal");
      expect(items[0]).toHaveClass("stripe", "ink");
      expect(
        screen.getAllByRole("link").map((a) => [a.textContent, a.getAttribute("href")]),
      ).toEqual([
        ["About", "/about"],
        ["What I do", "/what-i-do"],
        ["Chat with me", "/chat"],
        ["Contact", "/contact"],
      ]);
    });

    it("shows no Sublabels", async () => {
      await renderBoardAt("/skills");
      expect(screen.queryByText("36 Takeovers")).not.toBeInTheDocument();
      expect(screen.queryByText("AI agent trained on my data")).not.toBeInTheDocument();
    });

    it("opens another Panel, as a new history entry, on a click on its Stripe", async () => {
      await renderBoardAt("/skills");
      const entries = window.history.length;

      fireEvent.click(screen.getByRole("link", { name: "Contact" }));
      await waitFor(() => expect(window.location.pathname).toBe("/contact"));
      expect(window.history.length).toBe(entries + 1);
    });

    it("leaves a modified click on a Stripe to the browser", async () => {
      await renderBoardAt("/skills");

      expect(
        clickHandledByApp(screen.getByRole("link", { name: "Contact" }), { ctrlKey: true }),
      ).toBe(false);
    });

    it("closes to /explore, as a new history entry, on the close button", async () => {
      await renderBoardAt("/skills");
      const entries = window.history.length;

      fireEvent.click(screen.getByRole("button", { name: "Close Skills" }));
      await waitFor(() => expect(window.location.pathname).toBe("/explore"));
      expect(window.history.length).toBe(entries + 1);
    });

    it("closes to /explore on Escape", async () => {
      await renderBoardAt("/skills");

      fireEvent.keyDown(document, { key: "Escape" });
      await waitFor(() => expect(window.location.pathname).toBe("/explore"));
    });

    it("titles the close button from the messages", async () => {
      await renderBoardAt("/skills", { "board.panel.skills.close": "Skills schließen" });
      expect(screen.getByRole("button", { name: "Skills schließen" })).toBeInTheDocument();
    });
  });

  describe("the document", () => {
    beforeEach(() => {
      document.head.innerHTML =
        '<meta name="theme-color" content="#182223"><title>A.Durnev portfolio</title>';
      document.documentElement.style.setProperty("--panel-skills", "#67b3a8");
    });
    afterEach(() => {
      document.head.innerHTML = "";
      document.documentElement.removeAttribute("style");
    });

    it("keeps the site title and colour while no Panel is open", async () => {
      await renderBoardAt("/explore");
      expect(document.title).toBe("A.Durnev portfolio");
      expect(themeColor()).toBe("#182223");
    });

    it("is titled and coloured by the Expanded panel", async () => {
      await renderBoardAt("/skills");
      expect(document.title).toBe("Skills · A.Durnev portfolio");
      expect(themeColor()).toBe("#67b3a8");
    });

    it("takes the title from the messages", async () => {
      await renderBoardAt("/skills", { "board.expanded.documentTitle": "{site} / {panel}" });
      expect(document.title).toBe("A.Durnev portfolio / Skills");
    });

    it("gives the title and colour back when the Panel closes, the Board staying on screen", async () => {
      await renderBoardAt("/skills");
      fireEvent.click(screen.getByRole("button", { name: "Close Skills" }));
      await waitFor(() => expect(document.title).toBe("A.Durnev portfolio"));
      expect(themeColor()).toBe("#182223");
    });

    it("gives the title and colour back when the Board goes away", async () => {
      const { unmount } = await renderBoardAt("/skills");
      unmount();
      expect(document.title).toBe("A.Durnev portfolio");
      expect(themeColor()).toBe("#182223");
    });
  });
});
