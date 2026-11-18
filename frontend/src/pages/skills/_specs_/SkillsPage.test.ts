import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render, screen } from "@octanejs/testing-library";
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
    const firstGroup = container.querySelector("article")!;
    expect(heading.compareDocumentPosition(row!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(
      row!.compareDocumentPosition(firstGroup) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(stylesheet).toMatch(/\.skills-page__header-row\s*{[^}]*display:\s*flex/);
    expect(stylesheet).toMatch(
      /\.skills-page__header-row\s*{[^}]*justify-content:\s*space-between/,
    );
  });

  it("shows a block for every Skill group, in the content's order", () => {
    const { container } = renderPage();
    expect(container.querySelectorAll("article")).toHaveLength(SKILLS_CONTENT.groups.length);
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

  it("lists every Skill name and has every overview hidden", () => {
    const { container } = renderPage();
    const skillCount = SKILLS_CONTENT.groups.flatMap((g) => [
      ...g.skills,
      ...g.subgroups.flatMap((s) => s.skills),
    ]).length;
    const arrows = screen.getAllByRole("button", { name: /^Overview of / });
    expect(arrows).toHaveLength(skillCount);
    for (const arrow of arrows) expect(arrow).toHaveAttribute("aria-expanded", "false");
    expect(container.querySelectorAll("[inert]")).toHaveLength(skillCount);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL & MySQL")).toBeInTheDocument();
  });

  it("opens one Skill's overview with its arrow", () => {
    renderPage();
    const arrow = screen.getByRole("button", { name: "Overview of TypeScript" });
    fireEvent.click(arrow);
    expect(arrow).toHaveAttribute("aria-expanded", "true");
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
