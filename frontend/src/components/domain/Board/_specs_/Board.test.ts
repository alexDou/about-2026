import { fireEvent, render, screen } from "@octanejs/testing-library";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { intlWrapper } from "../../../../i18n";
import { Board } from ".././Board.tsrx";

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

describe("Board", () => {
  beforeEach(() => window.history.replaceState(null, "", "/explore"));
  afterEach(() => window.history.replaceState(null, "", "/"));

  it("lists the five Panel titles in order as links to their URLs", () => {
    render(Board, { props: {}, wrapper: intlWrapper() });
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
    render(Board, { props: {}, wrapper: intlWrapper() });
    const items = screen.getAllByRole("listitem");
    ["ink", "mist", "teal", "blue", "green"].forEach((tone, i) =>
      expect(items[i]).toHaveClass(tone),
    );
  });

  it("shows Sublabels on What I do and Chat with me only", () => {
    render(Board, { props: {}, wrapper: intlWrapper() });
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
      props: {},
      wrapper: intlWrapper({ "board.panel.about.title": "Über mich" }),
    });
    expect(screen.getByRole("link", { name: "Über mich" })).toHaveAttribute("href", "/about");
  });

  it("handles a plain click in the app, without a reload", () => {
    render(Board, { props: {}, wrapper: intlWrapper() });
    expect(clickHandledByApp(screen.getByRole("link", { name: "Skills" }))).toBe(true);
    expect(window.location.pathname).toBe("/skills");
  });

  it.each([
    ["Ctrl", { ctrlKey: true }],
    ["Meta", { metaKey: true }],
    ["middle", { button: 1 }],
  ])("leaves a %s click to the browser", (_name, init) => {
    render(Board, { props: {}, wrapper: intlWrapper() });
    expect(clickHandledByApp(screen.getByRole("link", { name: "Skills" }), init)).toBe(false);
    expect(window.location.pathname).toBe("/explore");
  });
});
