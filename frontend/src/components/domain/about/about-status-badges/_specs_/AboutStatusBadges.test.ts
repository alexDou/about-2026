import { render, screen, within } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { intlWrapper } from "../../../../../i18n";
import { STATUS_BADGE_KINDS } from "../config";
import type { AboutStatusBadge } from "../types";
import { AboutStatusBadges } from "../AboutStatusBadges.tsrx";

const badge = (kind: keyof typeof STATUS_BADGE_KINDS): AboutStatusBadge => ({
  kind,
  text: `about.badge.${kind}.text`,
  title: `about.badge.${kind}.title`,
});

const props = { badges: Object.values(STATUS_BADGE_KINDS).map(badge) };

const NAMES = [
  "AVAILABLE NOW",
  "FULL-TIME",
  "CONTRACT",
  "RELOCATION",
  "REMOTE WORK / READY",
  "AI READY",
];

describe("AboutStatusBadges", () => {
  it("shows the six badges in order, each named by its text", () => {
    render(AboutStatusBadges, { props, wrapper: intlWrapper() });
    const row = screen.getByRole("list");
    const items = within(row).getAllByRole("listitem");
    expect(items.map((item) => within(item).getByRole("img").getAttribute("aria-label"))).toEqual(
      NAMES,
    );
  });

  it("gives each badge its expressive title", () => {
    render(AboutStatusBadges, { props, wrapper: intlWrapper() });
    expect(screen.getByTitle("Can start immediately.")).toBeInTheDocument();
    expect(screen.getByTitle("Open to a permanent, full-time position.")).toBeInTheDocument();
    expect(screen.getByTitle("Open to contract work.")).toBeInTheDocument();
    expect(
      screen.getByTitle("Open to relocation anywhere, for the right offer."),
    ).toBeInTheDocument();
    expect(
      screen.getByTitle("Remote first, with years in distributed international teams."),
    ).toBeInTheDocument();
    expect(
      screen.getByTitle(
        "I build AI features into products and work with agentic, AI-assisted development.",
      ),
    ).toBeInTheDocument();
  });

  it("takes every text from the messages", () => {
    render(AboutStatusBadges, {
      props,
      wrapper: intlWrapper({
        "about.badge.fullTime.text": "VOLLZEIT",
        "about.badge.fullTime.title": "Unbefristet.",
      }),
    });
    expect(screen.getByRole("img", { name: "VOLLZEIT" })).toBeInTheDocument();
    expect(screen.getByTitle("Unbefristet.")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "FULL-TIME" })).not.toBeInTheDocument();
  });
});
