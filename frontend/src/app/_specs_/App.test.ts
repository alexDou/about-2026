import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createIntl } from "@formatjs/intl";
import { act, fireEvent, render, screen } from "@octanejs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { enMessages } from "../../i18n";
import { App } from ".././App.tsrx";

const board = () => screen.getByRole("main");
const panels = () => screen.getAllByRole("listitem");
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
      expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
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

  it("ships the site title in index.html for the time before JS runs", () => {
    // A path, not a URL: jsdom replaces the global `URL`, which `node:fs` then rejects.
    const html = readFileSync(join(import.meta.dirname, "../../../index.html"), "utf8");
    const intl = createIntl({ locale: "en", messages: enMessages });
    expect(html.match(/<title>(.*)<\/title>/)?.[1]).toBe(intl.formatMessage({ id: "site.title" }));
  });
});
