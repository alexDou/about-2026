import { act, fireEvent, render, screen } from "@octanejs/testing-library";
import { createElement } from "octane";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { intlWrapper } from "../../../../i18n";
import type { BoardState } from "../../../../hooks/useRoute";
import { Board } from ".././Board.tsrx";

const DEFAULT: BoardState = { kind: "default" };
const skills: BoardState = { kind: "expanded", panel: "skills" };
const page = createElement("p", null, "The page");

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

/** Puts the address bar at `path` and tells the app, as Back/Forward does. */
function arriveAt(path: string) {
  act(() => {
    window.history.replaceState(null, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
}

describe("Board", () => {
  beforeEach(() => arriveAt("/explore"));
  afterEach(() => arriveAt("/"));

  describe("with no Panel open", () => {
    it("lists the five Panel titles in order as links to their URLs", () => {
      render(Board, { props: { board: DEFAULT }, wrapper: intlWrapper() });
      const links = screen.getAllByRole("link");
      expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
        ["About", "/about"],
        ["What I do", "/what-i-do"],
        ["Skills", "/skills"],
        ["Chat with me", "/chat"],
        ["Contact", "/contact"],
      ]);
    });

    it("gives each Panel its tone by position", () => {
      render(Board, { props: { board: DEFAULT }, wrapper: intlWrapper() });
      const items = screen.getAllByRole("listitem");
      ["ink", "mist", "teal", "blue", "green"].forEach((tone, i) =>
        expect(items[i]).toHaveClass(tone),
      );
    });

    it("shows Sublabels on What I do and Chat with me only", () => {
      render(Board, { props: { board: DEFAULT }, wrapper: intlWrapper() });
      const items = screen.getAllByRole("listitem").map((item) => item.textContent);
      expect(items).toEqual([
        "About",
        "What I do36 Takeovers",
        "Skills",
        "Chat with meAI agent trained on my data",
        "Contact",
      ]);
    });

    it("takes the titles from the messages", () => {
      render(Board, {
        props: { board: DEFAULT },
        wrapper: intlWrapper({ "board.panel.about.title": "Über mich" }),
      });
      expect(screen.getByRole("link", { name: "Über mich" })).toHaveAttribute("href", "/about");
    });

    it("handles a plain click in the app, without a reload", () => {
      render(Board, { props: { board: DEFAULT }, wrapper: intlWrapper() });
      expect(clickHandledByApp(screen.getByRole("link", { name: "Skills" }))).toBe(true);
      expect(window.location.pathname).toBe("/skills");
    });

    it.each([
      ["Ctrl", { ctrlKey: true }],
      ["Meta", { metaKey: true }],
      ["middle", { button: 1 }],
    ])("leaves a %s click to the browser", (_name, init) => {
      render(Board, { props: { board: DEFAULT }, wrapper: intlWrapper() });
      expect(clickHandledByApp(screen.getByRole("link", { name: "Skills" }), init)).toBe(false);
      expect(window.location.pathname).toBe("/explore");
    });

    it("has no close button", () => {
      render(Board, { props: { board: DEFAULT }, wrapper: intlWrapper() });
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("with a Panel open", () => {
    const open = () =>
      render(Board, { props: { board: skills, children: page }, wrapper: intlWrapper() });

    it("shows the page in the Expanded panel and the other four Panels as Stripes, in order", () => {
      open();
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

    it("shows no Sublabels", () => {
      open();
      expect(screen.queryByText("36 Takeovers")).not.toBeInTheDocument();
      expect(screen.queryByText("AI agent trained on my data")).not.toBeInTheDocument();
    });

    it("opens another Panel, as a new history entry, on a click on its Stripe", () => {
      arriveAt("/skills");
      const entries = window.history.length;
      open();
      fireEvent.click(screen.getByRole("link", { name: "Contact" }));
      expect(window.location.pathname).toBe("/contact");
      expect(window.history.length).toBe(entries + 1);
    });

    it("leaves a modified click on a Stripe to the browser", () => {
      arriveAt("/skills");
      open();
      expect(
        clickHandledByApp(screen.getByRole("link", { name: "Contact" }), { ctrlKey: true }),
      ).toBe(false);
      expect(window.location.pathname).toBe("/skills");
    });

    it("closes to /explore, as a new history entry, on the close button", () => {
      arriveAt("/skills");
      const entries = window.history.length;
      open();
      fireEvent.click(screen.getByRole("button", { name: "Close Skills" }));
      expect(window.location.pathname).toBe("/explore");
      expect(window.history.length).toBe(entries + 1);
    });

    it("closes to /explore on Escape", () => {
      arriveAt("/skills");
      open();
      fireEvent.keyDown(document, { key: "Escape" });
      expect(window.location.pathname).toBe("/explore");
    });

    it("does nothing when the Expanded panel itself is clicked", () => {
      arriveAt("/skills");
      open();
      fireEvent.click(screen.getByText("The page"));
      expect(window.location.pathname).toBe("/skills");
    });

    it("titles the close button from the messages", () => {
      render(Board, {
        props: { board: skills, children: page },
        wrapper: intlWrapper({ "board.panel.skills.close": "Skills schließen" }),
      });
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

    it("keeps the site title and colour while no Panel is open", () => {
      render(Board, { props: { board: DEFAULT }, wrapper: intlWrapper() });
      expect(document.title).toBe("A.Durnev portfolio");
      expect(themeColor()).toBe("#182223");
    });

    it("is titled and coloured by the Expanded panel", () => {
      render(Board, { props: { board: skills, children: page }, wrapper: intlWrapper() });
      expect(document.title).toBe("Skills · A.Durnev portfolio");
      expect(themeColor()).toBe("#67b3a8");
    });

    it("takes the title from the messages", () => {
      render(Board, {
        props: { board: skills, children: page },
        wrapper: intlWrapper({ "board.expanded.documentTitle": "{site} / {panel}" }),
      });
      expect(document.title).toBe("A.Durnev portfolio / Skills");
    });

    it("gives the title and colour back when the Panel closes", () => {
      const { unmount } = render(Board, {
        props: { board: skills, children: page },
        wrapper: intlWrapper(),
      });
      unmount();
      expect(document.title).toBe("A.Durnev portfolio");
      expect(themeColor()).toBe("#182223");
    });
  });
});
