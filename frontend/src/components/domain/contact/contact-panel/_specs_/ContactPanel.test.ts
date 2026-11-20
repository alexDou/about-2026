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
};

const MESSAGES = {
  "contact.remote": "Remote, worldwide",
  "contact.profile.linkedin.label": "LinkedIn",
  "contact.profile.xing.label": "Xing",
  "contact.notice": "Used only to reply.",
};

const renderPanel = () =>
  render(ContactPanel, {
    props: { content, children: createElement("p", { "data-testid": "form" }, "the form") },
    wrapper: intlWrapper(MESSAGES),
  });

const follows = (a: Node, b: Node) =>
  Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

describe("ContactPanel", () => {
  it("says where the Owner works from, with a globe drawn beside it", () => {
    renderPanel();
    const remote = screen.getByText("Remote, worldwide");
    expect(remote.parentElement?.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
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

  it("runs the markup in the mobile order: remote line, links, form, notice", () => {
    renderPanel();
    const remote = screen.getByText("Remote, worldwide");
    const links = screen.getByRole("list");
    const form = screen.getByTestId("form");
    const notice = screen.getByText("Used only to reply.");
    expect(follows(remote, links)).toBe(true);
    expect(follows(links, form)).toBe(true);
    expect(follows(form, notice)).toBe(true);
  });
});
