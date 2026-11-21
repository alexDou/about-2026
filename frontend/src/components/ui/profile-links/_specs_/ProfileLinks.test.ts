import { render, screen, within } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { intlWrapper } from "../../../../i18n";
import { ProfileLinks } from "../ProfileLinks.tsrx";
import { PROFILE_KINDS, PROFILE_LOOKS } from "../config";
import type { ProfileLinksProps } from "../types";

const profiles: ProfileLinksProps["profiles"] = [
  {
    kind: PROFILE_KINDS.linkedin,
    label: "about.profile.linkedin.label",
    url: "https://li.test/me",
  },
  { kind: PROFILE_KINDS.xing, label: "about.name", url: "https://xing.test/me" },
  { kind: PROFILE_KINDS.github, label: "about.profile.github.label", url: "https://gh.test/me" },
];

// Any message id will do as a label; the test overrides its text.
const MESSAGES = {
  "about.profile.linkedin.label": "LinkedIn",
  "about.name": "Xing",
  "about.profile.github.label": "GitHub",
};

const renderLinks = (look?: ProfileLinksProps["look"]) =>
  render(ProfileLinks, { props: { profiles, look }, wrapper: intlWrapper(MESSAGES) });

describe("ProfileLinks", () => {
  it("links each profile, named by its label, in the order given", () => {
    renderLinks();
    const links = within(screen.getByRole("list")).getAllByRole("link");
    expect(
      links.map((link) => [link.getAttribute("aria-label"), link.getAttribute("href")]),
    ).toEqual([
      ["LinkedIn", "https://li.test/me"],
      ["Xing", "https://xing.test/me"],
      ["GitHub", "https://gh.test/me"],
    ]);
  });

  it("draws a different icon for each profile, hidden from assistive technology", () => {
    renderLinks();
    const links = within(screen.getByRole("list")).getAllByRole("link");
    const drawings = links.map((link) => {
      const svg = link.querySelector("svg");
      expect(svg?.getAttribute("aria-hidden")).toBe("true");
      return svg?.querySelector("use")?.getAttribute("href");
    });
    expect(drawings.every((href) => href?.endsWith("#icon"))).toBe(true);
    expect(new Set(drawings).size).toBe(profiles.length);
  });

  it("has the plain look unless told otherwise", () => {
    renderLinks();
    expect(screen.getByRole("list").className).toContain("profile-links--plain");
  });

  it.each(Object.values(PROFILE_LOOKS))(
    "wears the %s look on the list and on every link",
    (look) => {
      renderLinks(look);
      const list = screen.getByRole("list");
      expect(list.className).toContain(`profile-links--${look}`);
      for (const link of within(list).getAllByRole("link")) {
        expect(link.className).toContain(`profile-links__link--${look}`);
      }
    },
  );
});
