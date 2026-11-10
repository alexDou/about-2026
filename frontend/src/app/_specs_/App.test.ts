import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createIntl } from "@formatjs/intl";
import { act, fireEvent, render, screen, waitFor } from "@octanejs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RouterProvider } from "../../hooks/useRoute";
import { enMessages } from "../../i18n";
import { createSiteRouter } from "../router";

const board = () => screen.getByRole("main");
const panels = () => screen.getAllByRole("listitem");
const heading = () => screen.getByRole("heading", { level: 1 });
const logo = () => screen.queryByRole("button", { name: "Portfolio A.Durnev" });

/** Puts the address bar at `path`, as a visit to it does. */
function visit(path: string) {
  window.history.replaceState(null, "", path);
}

const siteRouters: ReturnType<typeof createSiteRouter>[] = [];

/** Shows the site at `path` and waits until the router has loaded it. */
async function renderAt(path: string) {
  visit(path);
  const router = createSiteRouter();
  siteRouters.push(router);
  render(RouterProvider, { props: { router } });
  await act(() => router.load());
  return router;
}

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>(() => new Promise(() => {})),
    );
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    visit("/");
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    // The site's routers are not made by `testRouter`; end their histories too.
    siteRouters.splice(0).forEach((router) => router.history.destroy());
    visit("/");
  });

  it("renders the Landing with the English messages", async () => {
    await renderAt("/");
    expect(logo()).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "About" })).not.toBeInTheDocument();
  });

  it.each(["/explore", "/about", "/what-i-do", "/skills", "/chat", "/contact"])(
    "renders the Board for a direct visit to %s",
    async (path) => {
      await renderAt(path);
      expect(board()).toBeInTheDocument();
      expect(logo()).not.toBeInTheDocument();
    },
  );

  it("replaces an unknown path by / and shows the Landing, without a history entry", async () => {
    const entries = window.history.length;
    await renderAt("/nope");
    await waitFor(() => expect(window.location.pathname).toBe("/"));
    expect(logo()).toBeInTheDocument();
    expect(window.history.length).toBe(entries);
  });

  it("replaces /explore/ by /explore and shows the Board, without a history entry", async () => {
    const entries = window.history.length;
    await renderAt("/explore/");
    await waitFor(() => expect(window.location.pathname).toBe("/explore"));
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(window.history.length).toBe(entries);
  });

  it("goes Landing → Board on the logo click, back on Back and forward on Forward", async () => {
    await renderAt("/");
    fireEvent.click(logo()!);
    expect(await screen.findByRole("link", { name: "About" })).toBeInTheDocument();
    expect(window.location.pathname).toBe("/explore");

    window.history.back();
    expect(await screen.findByRole("button", { name: "Portfolio A.Durnev" })).toBeInTheDocument();
    expect(window.location.pathname).toBe("/");

    window.history.forward();
    expect(await screen.findByRole("link", { name: "About" })).toBeInTheDocument();
  });

  describe("the Board's unfold", () => {
    it("plays when the logo click opens the Board", async () => {
      await renderAt("/");
      fireEvent.click(logo()!);
      await screen.findByRole("link", { name: "About" });
      panels().forEach((panel) => expect(panel).toHaveClass("entering"));
    });

    it("plays on a direct visit to the Board", async () => {
      await renderAt("/explore");
      panels().forEach((panel) => expect(panel).toHaveClass("entering"));
    });

    it("plays on Forward from the Landing", async () => {
      await renderAt("/");
      fireEvent.click(logo()!);
      await screen.findByRole("link", { name: "About" });
      window.history.back();
      await screen.findByRole("button", { name: "Portfolio A.Durnev" });
      window.history.forward();
      await screen.findByRole("link", { name: "About" });
      panels().forEach((panel) => expect(panel).toHaveClass("entering"));
    });
  });

  describe("opening and closing a Panel", () => {
    it.each([
      ["/about", "About"],
      ["/what-i-do", "What I do"],
      ["/skills", "Skills"],
      ["/chat", "Chat with me"],
      ["/contact", "Contact"],
    ])(
      "renders %s as that Panel opened, with its page and the other four as Stripes",
      async (path, title) => {
        await renderAt(path);
        expect(heading()).toHaveTextContent(title);
        expect(screen.getAllByRole("link")).toHaveLength(4);
        expect(screen.queryByRole("link", { name: title })).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: `Close ${title}` })).toBeInTheDocument();
      },
    );

    it("shows no page on the default Board", async () => {
      await renderAt("/explore");
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });

    it("opens a Panel from its title, then switches by Stripe, then closes, with Back/Forward through them", async () => {
      await renderAt("/explore");
      fireEvent.click(screen.getByRole("link", { name: "Skills" }));
      expect(await screen.findByRole("heading", { name: "Skills" })).toBeInTheDocument();
      fireEvent.click(screen.getByRole("link", { name: "Contact" }));
      expect(await screen.findByRole("heading", { name: "Contact" })).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Close Contact" }));
      await waitFor(() => expect(window.location.pathname).toBe("/explore"));
      await waitFor(() => expect(screen.queryByRole("heading")).not.toBeInTheDocument());

      window.history.back();
      expect(await screen.findByRole("heading", { name: "Contact" })).toBeInTheDocument();
      window.history.back();
      expect(await screen.findByRole("heading", { name: "Skills" })).toBeInTheDocument();
      window.history.forward();
      expect(await screen.findByRole("heading", { name: "Contact" })).toBeInTheDocument();
    });

    it("moves focus to the Expanded panel's heading on opening and on switching", async () => {
      await renderAt("/explore");
      fireEvent.click(screen.getByRole("link", { name: "Skills" }));
      await screen.findByRole("heading", { name: "Skills" });
      await waitFor(() => expect(heading()).toHaveFocus());
      fireEvent.click(screen.getByRole("link", { name: "Contact" }));
      await screen.findByRole("heading", { name: "Contact" });
      await waitFor(() => expect(heading()).toHaveFocus());
    });

    it("returns focus to the Panel that was open on closing, with the button and with Escape", async () => {
      await renderAt("/explore");
      fireEvent.click(screen.getByRole("link", { name: "Skills" }));
      await screen.findByRole("heading", { name: "Skills" });
      fireEvent.click(screen.getByRole("button", { name: "Close Skills" }));
      await waitFor(() => expect(screen.getByRole("link", { name: "Skills" })).toHaveFocus());

      fireEvent.click(screen.getByRole("link", { name: "Contact" }));
      await screen.findByRole("heading", { name: "Contact" });
      fireEvent.keyDown(document, { key: "Escape" });
      await waitFor(() => expect(screen.getByRole("link", { name: "Contact" })).toHaveFocus());
    });

    it("does not steal focus on a deep link", async () => {
      await renderAt("/skills");
      expect(heading()).not.toHaveFocus();
    });

    it("scrolls to the top on every change of Board state, with scroll restoration off", async () => {
      await renderAt("/explore");
      expect(window.history.scrollRestoration).toBe("manual");
      vi.mocked(window.scrollTo).mockClear();
      fireEvent.click(screen.getByRole("link", { name: "Skills" }));
      await waitFor(() => expect(window.scrollTo).toHaveBeenCalledTimes(1));
      fireEvent.click(screen.getByRole("link", { name: "Contact" }));
      await waitFor(() => expect(window.scrollTo).toHaveBeenCalledTimes(2));
      expect(window.scrollTo).toHaveBeenLastCalledWith(
        expect.objectContaining({ top: 0, left: 0 }),
      );

      vi.mocked(window.scrollTo).mockClear();
      window.history.back();
      await waitFor(() => expect(window.scrollTo).toHaveBeenCalledTimes(1));
    });

    it("does not replay the Board's unfold on the Panels that come back when a Panel closes", async () => {
      await renderAt("/");
      fireEvent.click(logo()!);
      await screen.findByRole("link", { name: "Skills" });
      fireEvent.click(screen.getByRole("link", { name: "Skills" }));
      await screen.findByRole("heading", { name: "Skills" });
      fireEvent.click(screen.getByRole("button", { name: "Close Skills" }));
      await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(5));
      panels().forEach((panel) => expect(panel).not.toHaveClass("entering"));
    });

    it("sets the document title per Expanded panel", async () => {
      await renderAt("/skills");
      expect(document.title).toBe("Skills · A.Durnev portfolio");
      fireEvent.click(screen.getByRole("button", { name: "Close Skills" }));
      await waitFor(() => expect(document.title).toBe("A.Durnev portfolio"));
    });
  });

  it("ships the site title in index.html for the time before JS runs", () => {
    // A path, not a URL: jsdom replaces the global `URL`, which `node:fs` then rejects.
    const html = readFileSync(join(import.meta.dirname, "../../../index.html"), "utf8");
    const intl = createIntl({ locale: "en", messages: enMessages });
    expect(html.match(/<title>(.*)<\/title>/)?.[1]).toBe(intl.formatMessage({ id: "site.title" }));
  });
});
