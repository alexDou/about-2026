import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createIntl } from "@formatjs/intl";
import { act, fireEvent, render, screen } from "@octanejs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { enMessages } from "../../i18n";
import { App } from ".././App.tsrx";

const board = () => screen.getByRole("main");
const panels = () => screen.getAllByRole("listitem");
const heading = () => screen.getByRole("heading", { level: 1 });
const logo = () => screen.queryByRole("button", { name: "Portfolio A.Durnev" });

/** Puts the address bar at `path` and tells the app, as Back/Forward does. */
function arriveAt(path: string) {
  act(() => {
    window.history.replaceState(null, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
}

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>(() => new Promise(() => {})),
    );
    arriveAt("/");
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    arriveAt("/");
  });

  it("renders the Landing with the English messages", () => {
    render(App, { props: {} });
    expect(logo()).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "About" })).not.toBeInTheDocument();
  });

  it.each(["/explore", "/about", "/what-i-do", "/skills", "/chat", "/contact"])(
    "renders the Board for a direct visit to %s",
    (path) => {
      arriveAt(path);
      render(App, { props: {} });
      expect(board()).toBeInTheDocument();
      expect(logo()).not.toBeInTheDocument();
    },
  );

  it("replaces an unknown path by / and shows the Landing", () => {
    arriveAt("/nope");
    render(App, { props: {} });
    expect(window.location.pathname).toBe("/");
    expect(logo()).toBeInTheDocument();
  });

  it("replaces /explore/ by /explore and shows the Board", () => {
    arriveAt("/explore/");
    render(App, { props: {} });
    expect(window.location.pathname).toBe("/explore");
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("goes Landing → Board on the logo click, back on Back and forward on Forward", async () => {
    render(App, { props: {} });
    fireEvent.click(logo()!);
    expect(await screen.findByRole("link", { name: "About" })).toBeInTheDocument();
    expect(window.location.pathname).toBe("/explore");

    window.history.back();
    expect(await screen.findByRole("button", { name: "Portfolio A.Durnev" })).toBeInTheDocument();
    expect(window.location.pathname).toBe("/");

    window.history.forward();
    expect(await screen.findByRole("link", { name: "About" })).toBeInTheDocument();
  });

  describe("the Board's entrance", () => {
    it("plays when the logo click opens the Board", async () => {
      render(App, { props: {} });
      fireEvent.click(logo()!);
      await screen.findByRole("link", { name: "About" });
      expect(board()).toHaveClass("entrance");
      panels().forEach((panel) => expect(panel).toHaveClass("entering"));
    });

    it("keeps its class while a Panel link is followed from the Board", async () => {
      render(App, { props: {} });
      fireEvent.click(logo()!);
      await screen.findByRole("link", { name: "About" });
      fireEvent.click(screen.getByRole("link", { name: "Skills" }));
      expect(window.location.pathname).toBe("/skills");
      expect(board()).toHaveClass("entrance");
    });

    it("does not play on a direct visit", () => {
      arriveAt("/explore");
      render(App, { props: {} });
      expect(board()).not.toHaveClass("entrance");
      panels().forEach((panel) => expect(panel).not.toHaveClass("entering"));
    });

    it("does not play on Forward from the Landing", async () => {
      arriveAt("/explore");
      arriveAt("/");
      render(App, { props: {} });
      act(() => {
        window.history.replaceState(null, "", "/explore");
        window.dispatchEvent(new PopStateEvent("popstate"));
      });
      await screen.findByRole("link", { name: "About" });
      expect(board()).not.toHaveClass("entrance");
    });
  });

  describe("opening and closing a Panel", () => {
    beforeEach(() => {
      vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    });

    it.each([
      ["/about", "About"],
      ["/what-i-do", "What I do"],
      ["/skills", "Skills"],
      ["/chat", "Chat with me"],
      ["/contact", "Contact"],
    ])(
      "renders %s as that Panel opened, with its page and the other four as Stripes",
      (path, title) => {
        arriveAt(path);
        render(App, { props: {} });
        expect(heading()).toHaveTextContent(title);
        expect(screen.getAllByRole("link")).toHaveLength(4);
        expect(screen.queryByRole("link", { name: title })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: `Close ${title}` })).toBeInTheDocument();
      },
    );

    it("shows no page on the default Board", () => {
      arriveAt("/explore");
      render(App, { props: {} });
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });

    it("opens a Panel from its title, then switches by Stripe, then closes, with Back/Forward through them", async () => {
      arriveAt("/explore");
      render(App, { props: {} });
      fireEvent.click(screen.getByRole("link", { name: "Skills" }));
      expect(heading()).toHaveTextContent("Skills");
      fireEvent.click(screen.getByRole("link", { name: "Contact" }));
      expect(heading()).toHaveTextContent("Contact");
      fireEvent.click(screen.getByRole("button", { name: "Close Contact" }));
      expect(window.location.pathname).toBe("/explore");
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();

      window.history.back();
      expect(await screen.findByRole("heading", { name: "Contact" })).toBeInTheDocument();
      window.history.back();
      expect(await screen.findByRole("heading", { name: "Skills" })).toBeInTheDocument();
      window.history.forward();
      expect(await screen.findByRole("heading", { name: "Contact" })).toBeInTheDocument();
    });

    it("moves focus to the Expanded panel's heading on opening and on switching", () => {
      arriveAt("/explore");
      render(App, { props: {} });
      fireEvent.click(screen.getByRole("link", { name: "Skills" }));
      expect(heading()).toHaveFocus();
      fireEvent.click(screen.getByRole("link", { name: "Contact" }));
      expect(heading()).toHaveTextContent("Contact");
      expect(heading()).toHaveFocus();
    });

    it("returns focus to the Panel that was open on closing, with the button and with Escape", () => {
      arriveAt("/explore");
      render(App, { props: {} });
      fireEvent.click(screen.getByRole("link", { name: "Skills" }));
      fireEvent.click(screen.getByRole("button", { name: "Close Skills" }));
      expect(screen.getByRole("link", { name: "Skills" })).toHaveFocus();

      fireEvent.click(screen.getByRole("link", { name: "Contact" }));
      fireEvent.keyDown(document, { key: "Escape" });
      expect(screen.getByRole("link", { name: "Contact" })).toHaveFocus();
    });

    it("does not steal focus on a deep link", () => {
      arriveAt("/skills");
      render(App, { props: {} });
      expect(heading()).not.toHaveFocus();
    });

    it("scrolls to the top on every change of Board state, with scroll restoration off", () => {
      arriveAt("/explore");
      render(App, { props: {} });
      expect(window.history.scrollRestoration).toBe("manual");
      expect(window.scrollTo).not.toHaveBeenCalled();
      fireEvent.click(screen.getByRole("link", { name: "Skills" }));
      expect(window.scrollTo).toHaveBeenCalledTimes(1);
      fireEvent.click(screen.getByRole("link", { name: "Contact" }));
      expect(window.scrollTo).toHaveBeenCalledTimes(2);
      expect(window.scrollTo).toHaveBeenLastCalledWith(0, 0);
    });

    it("does not replay the Board's unfold on the Panels that come back when a Panel closes", async () => {
      render(App, { props: {} });
      fireEvent.click(logo()!);
      await screen.findByRole("link", { name: "Skills" });
      fireEvent.click(screen.getByRole("link", { name: "Skills" }));
      fireEvent.click(screen.getByRole("button", { name: "Close Skills" }));
      panels().forEach((panel) => expect(panel).not.toHaveClass("entering"));
    });

    it("sets the document title per Expanded panel", () => {
      arriveAt("/skills");
      render(App, { props: {} });
      expect(document.title).toBe("Skills · A.Durnev portfolio");
      fireEvent.click(screen.getByRole("button", { name: "Close Skills" }));
      expect(document.title).toBe("A.Durnev portfolio");
    });
  });

  it("ships the site title in index.html for the time before JS runs", () => {
    // A path, not a URL: jsdom replaces the global `URL`, which `node:fs` then rejects.
    const html = readFileSync(join(import.meta.dirname, "../../../index.html"), "utf8");
    const intl = createIntl({ locale: "en", messages: enMessages });
    expect(html.match(/<title>(.*)<\/title>/)?.[1]).toBe(intl.formatMessage({ id: "site.title" }));
  });
});
