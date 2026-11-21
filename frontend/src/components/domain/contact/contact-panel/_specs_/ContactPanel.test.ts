import { render, screen, within } from "@octanejs/testing-library";
import { createElement } from "octane";
import { describe, expect, it } from "vitest";
import { intlWrapper } from "../../../../../i18n";
import { ContactPanel } from "../ContactPanel.tsrx";
import type { ContactPanelProps } from "../types";

const content: ContactPanelProps["content"] = {
  remote: "contact.remote",
  profiles: [
    { kind: "linkedin", label: "contact.profile.linkedin.label", url: "https://li.test/me" },
    { kind: "xing", label: "contact.profile.xing.label", url: "https://xing.test/me" },
  ],
  notice: "contact.notice",
  required: "contact.required",
};

const media: ContactPanelProps["media"] = { globe: "globe.svg" };

const MESSAGES = {
  "contact.remote": "Remote, worldwide",
  "contact.profile.linkedin.label": "LinkedIn",
  "contact.profile.xing.label": "Xing",
  "contact.notice": "Used only to reply.",
  "contact.required": "* required",
};

const renderPanel = () =>
  render(ContactPanel, {
    props: { content, media, children: createElement("p", { "data-testid": "form" }, "the form") },
    wrapper: intlWrapper(MESSAGES),
  });

const follows = (a: Node, b: Node) =>
  Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

describe("ContactPanel", () => {
  it("says where the Owner works from, with the globe icon drawn beside it", () => {
    renderPanel();
    const remote = screen.getByText("Remote, worldwide");
    const globe = remote.parentElement?.querySelector("svg");
    expect(globe?.getAttribute("aria-hidden")).toBe("true");
    expect(globe?.querySelector("use")?.getAttribute("href")).toBe("globe.svg#icon");
  });

  it("links LinkedIn and then Xing as ring-look icons, each named by its label", () => {
    renderPanel();
    const links = within(screen.getByRole("list")).getAllByRole("link");
    expect(
      links.map((link) => [link.getAttribute("aria-label"), link.getAttribute("href")]),
    ).toEqual([
      ["LinkedIn", "https://li.test/me"],
      ["Xing", "https://xing.test/me"],
    ]);
    expect(screen.getByRole("list").className).toContain("profile-links--ring");
  });

  it("shows the Contact notice", () => {
    renderPanel();
    expect(screen.getByText("Used only to reply.")).toBeInTheDocument();
  });

  it("holds what it is given in the form column", () => {
    renderPanel();
    expect(screen.getByTestId("form")).toBeInTheDocument();
  });

  it("explains the form's asterisk", () => {
    renderPanel();
    expect(screen.getByText("* required")).toBeInTheDocument();
  });

  it("runs the info block in the order of a wide screen, then the form", () => {
    renderPanel();
    const remote = screen.getByText("Remote, worldwide");
    const notice = screen.getByText("Used only to reply.");
    const links = screen.getByRole("list");
    const required = screen.getByText("* required");
    const form = screen.getByTestId("form");
    expect(follows(remote, notice)).toBe(true);
    expect(follows(notice, links)).toBe(true);
    expect(follows(links, required)).toBe(true);
    expect(follows(required, form)).toBe(true);
  });

  it("separates the remote line, the notice, the links and the required line by rules", () => {
    renderPanel();
    const rules = screen.getAllByRole("separator");
    expect(rules).toHaveLength(3);
    const remote = screen.getByText("Remote, worldwide");
    const notice = screen.getByText("Used only to reply.");
    const links = screen.getByRole("list");
    const required = screen.getByText("* required");
    const [first, second, third] = rules as [HTMLElement, HTMLElement, HTMLElement];
    expect(follows(remote, first) && follows(first, notice)).toBe(true);
    expect(follows(notice, second) && follows(second, links)).toBe(true);
    expect(follows(links, third) && follows(third, required)).toBe(true);
  });

  it("holds the notice and the required line as blocks of their own, not paragraphs", () => {
    renderPanel();
    expect(screen.getByText("Used only to reply.").tagName).toBe("DIV");
    expect(screen.getByText("* required").tagName).toBe("DIV");
  });
});
