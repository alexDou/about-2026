import { act, fireEvent, screen, waitFor } from "@octanejs/testing-library";
import { afterEach, describe, expect, it } from "vitest";
import { endEntrance, renderBoardAt } from "./helpers";

const path = () => window.location.pathname;
const titles = () => screen.getAllByRole("link").map((title) => title.parentElement as Element);

/** The browser ends the fade-in of the titles at `indexes`. */
async function endTitles(indexes: number[]) {
  await act(() => {
    indexes.forEach((index) => fireEvent.animationEnd(titles()[index] as Element));
  });
}

async function click(name: string) {
  await act(() => {
    fireEvent.click(screen.getByRole("link", { name }));
  });
}

afterEach(() => {
  Reflect.deleteProperty(window, "matchMedia");
  window.history.replaceState(null, "", "/");
});

describe("the Board's entrance", () => {
  it("ignores a click on a Panel until every title has faded in", async () => {
    await renderBoardAt("/explore", undefined, { entrance: true });
    await click("Skills");
    expect(path()).toBe("/explore");

    await endEntrance();
    await click("Skills");
    await waitFor(() => expect(path()).toBe("/skills"));
  });

  it("waits for every title, not just the first", async () => {
    await renderBoardAt("/explore", undefined, { entrance: true });
    await endTitles([0, 1, 2, 3]);
    await click("Skills");
    expect(path()).toBe("/explore");

    await endTitles([4]);
    await click("Skills");
    await waitFor(() => expect(path()).toBe("/skills"));
  });

  it("does not count an animation inside a title as the title's fade-in", async () => {
    await renderBoardAt("/explore", undefined, { entrance: true });
    await act(() => {
      screen.getAllByRole("link").forEach((link) => fireEvent.animationEnd(link));
    });
    await click("Skills");
    expect(path()).toBe("/explore");
  });

  it("lets a modified click through, which opens a new tab and leaves the Board alone", async () => {
    await renderBoardAt("/explore", undefined, { entrance: true });
    let handled = true;
    document.addEventListener(
      "click",
      (event) => {
        handled = event.defaultPrevented;
        event.preventDefault();
      },
      { once: true },
    );
    fireEvent.click(screen.getByRole("link", { name: "Skills" }), { ctrlKey: true });
    expect(handled).toBe(false);
    expect(path()).toBe("/explore");
  });

  it("has no unfold to wait for on a direct visit to an Expanded panel: it closes at once", async () => {
    await renderBoardAt("/skills", undefined, { entrance: true });
    await act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Close Skills" }));
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(path()).toBe("/explore");
  });

  it("takes clicks at once with reduced motion, which has no entrance", async () => {
    window.matchMedia = ((query: string) =>
      ({ matches: query.includes("reduce") }) as MediaQueryList) as typeof window.matchMedia;
    await renderBoardAt("/explore", undefined, { entrance: true });
    await click("Skills");
    await waitFor(() => expect(path()).toBe("/skills"));
  });

  it("never blocks again once it has ended", async () => {
    await renderBoardAt("/explore", undefined, { entrance: true });
    await endEntrance();
    await endEntrance();
    await click("Skills");
    await waitFor(() => expect(path()).toBe("/skills"));
  });

  it("shows an Expanded panel at once on a mount at its URL: no unfold", async () => {
    await renderBoardAt("/skills", undefined, { entrance: true });
    const slots = screen.getAllByRole("listitem");
    expect(slots[2]).toHaveClass("slot--expanded");
    expect(screen.getByText("The page")).toBeInTheDocument();
    slots.forEach((slot) => expect(slot).not.toHaveClass("slot--entering"));
  });

  it("plays again when the Board mounts again", async () => {
    const first = await renderBoardAt("/explore", undefined, { entrance: true });
    await endEntrance();
    await click("Skills");
    await waitFor(() => expect(path()).toBe("/skills"));
    first.unmount();

    await renderBoardAt("/explore", undefined, { entrance: true });
    screen.getAllByRole("listitem").forEach((slot) => expect(slot).toHaveClass("slot--entering"));
    await click("Skills");
    expect(path()).toBe("/explore");
  });
});
