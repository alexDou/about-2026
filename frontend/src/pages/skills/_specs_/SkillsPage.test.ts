import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render, screen, within } from "@octanejs/testing-library";
import { afterEach, describe, expect, it } from "vitest";
import { intlWrapper } from "../../../i18n";
import { SKILLS_CONTENT } from "../content";
import { SkillsPage } from "../SkillsPage.tsrx";
import styles from "../styles.module.css";

const renderPage = (overrides: Parameters<typeof intlWrapper>[0] = {}) =>
  render(SkillsPage, { props: {}, wrapper: intlWrapper(overrides) });

const stylesheet = readFileSync(resolve(import.meta.dirname, "../styles.module.css"), "utf8");

afterEach(() => {
  document.body.innerHTML = "";
});

describe("SkillsPage", () => {
  it("opens with the Skills heading, taken from the Panel's message", () => {
    renderPage({ "explore.panel.skills.title": "Titel" });
    expect(screen.getByRole("heading", { level: 1, name: "Titel" })).toBeInTheDocument();
  });

  it("has the header row after the heading and before the groups, with room for two controls", () => {
    const { container } = renderPage();
    const row = container.querySelector(`.${styles["skills-page__header-row"]}`);
    expect(row).not.toBeNull();
    const heading = screen.getByRole("heading", { level: 1 });
    const firstGroup = screen.getByRole("heading", { level: 2, name: "Programming languages" });
    expect(heading.compareDocumentPosition(row!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(
      row!.compareDocumentPosition(firstGroup) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(stylesheet).toMatch(/\.skills-page__header-row\s*{[^}]*display:\s*flex/);
    expect(stylesheet).toMatch(
      /\.skills-page__header-row\s*{[^}]*justify-content:\s*space-between/,
    );
  });

  it("shows a band for every Skill group, in the content's order, in one accordion", () => {
    const { container } = renderPage();
    const accordion = container.querySelector(`.${styles["skills-page__accordion"]}`)!;
    expect(accordion.children).toHaveLength(SKILLS_CONTENT.groups.length);
    expect(accordion.querySelectorAll("article")).toHaveLength(0);
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
      "Programming languages",
      "Frontend",
      "Backend",
      "AI",
      "Databases & search",
      "Cloud & DevOps",
      "Testing & quality",
      "Engineering practice",
    ]);
  });

  it("starts with every group closed, so only the group names are within reach", () => {
    const { container } = renderPage();
    const bands = screen.getAllByRole("heading", { level: 2 });
    for (const band of bands) {
      expect(within(band).getByRole("button")).toHaveAttribute("aria-expanded", "false");
    }
    const panels = container.querySelectorAll("section > [inert]");
    expect(panels).toHaveLength(SKILLS_CONTENT.groups.length);
  });

  it("lists every Skill, each with its overview closed, once its group is open", () => {
    const skillCount = SKILLS_CONTENT.groups.flatMap((g) => [
      ...g.skills,
      ...g.subgroups.flatMap((s) => s.skills),
    ]).length;
    renderPage();
    for (const band of screen.getAllByRole("heading", { level: 2 })) {
      fireEvent.click(within(band).getByRole("button"));
    }
    const arrows = screen.getAllByRole("button", { name: /^Overview of / });
    expect(arrows).toHaveLength(skillCount);
    for (const arrow of arrows) expect(arrow).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL & MySQL")).toBeInTheDocument();
  });

  it("closes the overviews and the band again on the next click", () => {
    renderPage();
    const band = screen.getByRole("button", { name: "Backend" });
    fireEvent.click(band);
    expect(band).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(band);
    expect(band).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Overview of Node.js" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("has square corners", () => {
    expect(stylesheet).not.toMatch(/border-radius/);
  });

  it("puts a strip before and after the accordion's bands", () => {
    expect(stylesheet).toMatch(
      /\.skills-page__accordion::before,\s*\.skills-page__accordion::after\s*{[^}]*content:\s*""/,
    );
    expect(stylesheet).toMatch(
      /\.skills-page__accordion::before,\s*\.skills-page__accordion::after\s*{[^}]*height:/,
    );
  });

  it("opens one Skill's overview with its arrow", () => {
    renderPage();
    const arrow = screen.getByRole("button", { name: "Overview of TypeScript" });
    fireEvent.click(arrow);
    expect(arrow).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Programming languages" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("starts closed again on a new visit", () => {
    const first = renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Frontend" }));
    first.unmount();
    renderPage();
    expect(screen.getByRole("button", { name: "Frontend" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("button", { name: "Overview of React" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
