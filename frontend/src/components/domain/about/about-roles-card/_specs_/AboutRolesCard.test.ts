import { render, screen, within } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { intlWrapper } from "../../../../../i18n";
import { AboutRolesCard } from "../AboutRolesCard.tsrx";
import type { AboutRolesCardProps } from "../types";

const props: AboutRolesCardProps = {
  heading: "about.heading.roles",
  technologiesLabel: "about.roles.technologiesLabel",
  roleLine: "about.role.line",
  roles: [
    {
      title: "about.role.1.title",
      company: "about.role.1.company",
      period: "about.role.1.period",
      place: "about.role.1.place",
      highlights: ["about.role.1.highlight.1", "about.role.1.highlight.2"],
      technologies: "about.role.1.technologies",
    },
    {
      title: "about.role.2.title",
      company: "about.role.2.company",
      period: "about.role.2.period",
      place: "about.role.2.place",
      intro: "about.role.2.intro",
      highlights: ["about.role.2.highlight.1"],
      technologies: "about.role.2.technologies",
    },
  ],
};

const MESSAGES = {
  "about.heading.roles": "Work",
  "about.roles.technologiesLabel": "Stack:",
  "about.role.line": "{company} | {period} | {place}",
  "about.role.1.title": "Lead",
  "about.role.1.company": "Acme",
  "about.role.1.period": "2022 – 2026",
  "about.role.1.place": "Berlin",
  "about.role.1.highlight.1": "Built A. My role: lead.",
  "about.role.1.highlight.2": "Built B. My role: author.",
  "about.role.1.technologies": "TypeScript, React",
  "about.role.2.title": "Developer",
  "about.role.2.company": "Globex",
  "about.role.2.period": "2019 – 2022",
  "about.role.2.place": "Remote",
  "about.role.2.intro": "A big rewrite.",
  "about.role.2.highlight.1": "Built C. My role: all of it.",
  "about.role.2.technologies": "Java, React",
};

const renderCard = () => render(AboutRolesCard, { props, wrapper: intlWrapper(MESSAGES) });

describe("AboutRolesCard", () => {
  it("has its heading from the messages", () => {
    renderCard();
    expect(screen.getByRole("heading", { level: 2, name: "Work" })).toBeInTheDocument();
  });

  it("lists the Roles in the order given, each titled", () => {
    renderCard();
    const roles = within(screen.getAllByRole("list")[0]!).getAllByRole("heading", {
      level: 3,
    });
    expect(roles.map((heading) => heading.textContent)).toEqual(["Lead", "Developer"]);
  });

  it("shows each Role's company, period and place", () => {
    renderCard();
    expect(screen.getByText("Acme | 2022 – 2026 | Berlin")).toBeInTheDocument();
  });

  it("lists each Role's highlights in order", () => {
    renderCard();
    const highlights = screen.getByText("Built A. My role: lead.").closest("ul")!;
    expect(
      within(highlights)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(["Built A. My role: lead.", "Built B. My role: author."]);
  });

  it("shows the intro only for a Role that has one, above its highlights", () => {
    renderCard();
    const intro = screen.getByText("A big rewrite.");
    expect(screen.getAllByText(/^A big rewrite\.$/)).toHaveLength(1);
    const highlight = screen.getByText("Built C. My role: all of it.");
    expect(
      intro.compareDocumentPosition(highlight) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("ends each Role with its technologies line, labelled", () => {
    renderCard();
    expect(screen.getByText("TypeScript, React").closest("p")?.textContent).toBe(
      "Stack: TypeScript, React",
    );
    expect(screen.getByText("Java, React").closest("p")?.textContent).toBe("Stack: Java, React");
  });
});
