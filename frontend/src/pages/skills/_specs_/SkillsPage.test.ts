import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { act, fireEvent, render, screen, within } from "@octanejs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { intlWrapper } from "../../../i18n";
import { SKILLS_CONTENT } from "../content";
import { SkillsPage } from "../SkillsPage.tsrx";
import styles from "../styles.module.css";

const renderPage = (overrides: Parameters<typeof intlWrapper>[0] = {}) =>
  render(SkillsPage, { props: {}, wrapper: intlWrapper(overrides) });

const stylesheet = readFileSync(resolve(import.meta.dirname, "../styles.module.css"), "utf8");

/** Click the toggle and let its walk end, as the handle in the header row reports it. */
const walk = (container: HTMLElement, name: "Expand all" | "Collapse all") => {
  fireEvent.click(screen.getByRole("button", { name }));
  const row = container.querySelector(`.${styles["skills-page__header-row"]}`)!;
  fireEvent.animationEnd(row.querySelector("svg")!);
};

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

  it("has Copy skills in the header row, after Expand all, which comes first", () => {
    const { container } = renderPage();
    const row = container.querySelector(`.${styles["skills-page__header-row"]}`)!;
    const expand = within(row as HTMLElement).getByRole("button", { name: "Expand all" });
    const copy = within(row as HTMLElement).getByRole("button", { name: "Copy skills" });
    expect(expand.compareDocumentPosition(copy) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("copies all the Skills, whatever is open: every group is in the text while all are closed", async () => {
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    renderPage();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy skills" }));
    });
    const lines = writeText.mock.calls[0]![0].split("\n");
    // Every group the page shows is in the text, though all of them are closed.
    for (const heading of screen.getAllByRole("heading", { level: 2 })) {
      expect(lines).toContain(heading.textContent);
    }
    expect(lines.slice(0, 2)).toEqual(["Programming languages", "  TypeScript"]);
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
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
    expect(screen.getByRole("button", { name: "Overview of TypeScript" })).toBeInTheDocument();
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

  it("ends the accordion's bands with a strip, and has none above them", () => {
    expect(stylesheet).toMatch(/\.skills-page__accordion::after\s*{[^}]*content:\s*""[^}]*height:/);
    expect(stylesheet).not.toMatch(/\.skills-page__accordion::before/);
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

  describe("Expand all", () => {
    it('sits in the header row, off, named "Expand all", and opens nothing on load', () => {
      const { container } = renderPage();
      const row = container.querySelector(`.${styles["skills-page__header-row"]}`)!;
      expect(within(row as HTMLElement).getByRole("button", { name: "Expand all" })).toBeVisible();
      for (const band of screen.getAllByRole("heading", { level: 2 })) {
        expect(within(band).getByRole("button")).toHaveAttribute("aria-expanded", "false");
      }
    });

    it("opens every group and every overview once its walk has ended, not on the click", () => {
      const { container } = renderPage();
      fireEvent.click(screen.getByRole("button", { name: "Expand all" }));
      expect(screen.getByRole("button", { name: "Backend" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
      const row = container.querySelector(`.${styles["skills-page__header-row"]}`)!;
      fireEvent.animationEnd(row.querySelector("svg")!);
      for (const band of screen.getAllByRole("heading", { level: 2 })) {
        expect(within(band).getByRole("button")).toHaveAttribute("aria-expanded", "true");
      }
      for (const arrow of screen.getAllByRole("button", { name: /^Overview of / })) {
        expect(arrow).toHaveAttribute("aria-expanded", "true");
      }
    });

    it("closes every overview and every group when turned off again", () => {
      const { container } = renderPage();
      walk(container, "Expand all");
      walk(container, "Collapse all");
      for (const band of screen.getAllByRole("heading", { level: 2 })) {
        expect(within(band).getByRole("button")).toHaveAttribute("aria-expanded", "false");
      }
      for (const arrow of screen.getAllByRole("button", { name: /^Overview of / })) {
        expect(arrow).toHaveAttribute("aria-expanded", "false");
      }
    });

    it("keeps the position the Visitor gave it: opening everything by hand leaves it off", () => {
      renderPage();
      for (const band of screen.getAllByRole("heading", { level: 2 })) {
        fireEvent.click(within(band).getByRole("button"));
      }
      expect(screen.getByRole("button", { name: "Expand all" })).toBeInTheDocument();
    });

    it("keeps it on when some is closed by hand", () => {
      const { container } = renderPage();
      walk(container, "Expand all");
      fireEvent.click(screen.getByRole("button", { name: "Backend" }));
      fireEvent.click(screen.getByRole("button", { name: "Overview of TypeScript" }));
      expect(screen.getByRole("button", { name: "Collapse all" })).toBeInTheDocument();
    });
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
