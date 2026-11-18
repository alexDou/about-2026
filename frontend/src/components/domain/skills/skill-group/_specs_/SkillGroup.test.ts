import { fireEvent, render, screen, within } from "@octanejs/testing-library";
import { afterEach, describe, expect, it } from "vitest";
import { intlWrapper } from "../../../../../i18n";
import { reset } from "../../overviews";
import { SkillGroup } from "../SkillGroup.tsrx";
import type { SkillEntrySkill } from "../../skill-entry";
import type { SkillGroupData } from "../types";

type TestSkillId = "react" | "vue" | "css" | "seo" | "postgresMysql" | "redis" | "mongodb";

const skill = (id: TestSkillId): SkillEntrySkill => ({
  id,
  name: `skills.skill.${id}.name`,
  overview: `skills.skill.${id}.overview`,
});

/** Frontend-like: Skills of its own and a subgroup. */
const FRONTEND = {
  id: "frontend",
  name: "skills.group.frontend.name",
  skills: [skill("react"), skill("vue")],
  subgroups: [
    {
      id: "architectureEcosystem",
      name: "skills.subgroup.architectureEcosystem.name",
      skills: [skill("css"), skill("seo")],
    },
  ],
} satisfies SkillGroupData;

/** Databases-like: no Skills of its own, two subgroups. */
const DATABASES = {
  id: "databases",
  name: "skills.group.databases.name",
  skills: [],
  subgroups: [
    { id: "sql", name: "skills.subgroup.sql.name", skills: [skill("postgresMysql")] },
    { id: "nosql", name: "skills.subgroup.nosql.name", skills: [skill("redis"), skill("mongodb")] },
  ],
} satisfies SkillGroupData;

const renderGroup = (group: SkillGroupData) =>
  render(SkillGroup, { props: { group }, wrapper: intlWrapper() });

const arrows = () => screen.getAllByRole("button", { name: /^Overview of / });
const openArrows = () => arrows().filter((a) => a.getAttribute("aria-expanded") === "true");

afterEach(reset);

describe("SkillGroup", () => {
  it("is a block with the group name as a heading, then its Skills, then its subgroups", () => {
    const { container } = renderGroup(FRONTEND);
    expect(container.firstElementChild?.tagName).toBe("ARTICLE");
    const headings = screen.getAllByRole("heading").map((h) => h.textContent);
    expect(headings).toEqual(["Frontend", "Architecture & ecosystem"]);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Frontend");
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Architecture & ecosystem");
    const text = container.textContent ?? "";
    const order = ["React", "Vue", "Architecture & ecosystem", "CSS", "SEO"].map((name) =>
      text.indexOf(name),
    );
    expect(order).toEqual(order.toSorted((a, b) => a - b));
    expect(order).not.toContain(-1);
  });

  it("shows every Skill name with every overview hidden", () => {
    renderGroup(FRONTEND);
    expect(arrows()).toHaveLength(4);
    expect(openArrows()).toHaveLength(0);
    for (const name of ["React", "Vue", "CSS", "SEO"]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("lists the Skills of a subgroup inside it", () => {
    renderGroup(FRONTEND);
    const subgroup = screen.getByRole("heading", { level: 3 }).closest("section")!;
    expect(within(subgroup).getAllByRole("listitem")).toHaveLength(2);
  });

  it("has no list of its own where the group holds no Skills of its own", () => {
    const { container } = renderGroup(DATABASES);
    expect(container.querySelectorAll(":scope > article > ul")).toHaveLength(0);
    expect(arrows()).toHaveLength(3);
  });

  it("opens one overview with its arrow and leaves the rest closed", () => {
    renderGroup(FRONTEND);
    fireEvent.click(screen.getByRole("button", { name: "Overview of Vue" }));
    expect(openArrows().map((a) => a.getAttribute("aria-label"))).toEqual(["Overview of Vue"]);
    expect(screen.getByRole("button", { name: "Frontend" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("opens and closes all its Skills from the group heading, subgroups' included", () => {
    renderGroup(FRONTEND);
    const heading = screen.getByRole("button", { name: "Frontend" });
    fireEvent.click(heading);
    expect(openArrows()).toHaveLength(4);
    expect(screen.getByRole("button", { name: "Architecture & ecosystem" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    fireEvent.click(heading);
    expect(openArrows()).toHaveLength(0);
    expect(screen.getByRole("button", { name: "Architecture & ecosystem" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("lets a subgroup heading act on its own Skills only", () => {
    renderGroup(DATABASES);
    fireEvent.click(screen.getByRole("button", { name: "NoSQL" }));
    expect(openArrows().map((a) => a.getAttribute("aria-label"))).toEqual([
      "Overview of Redis",
      "Overview of MongoDB",
    ]);
    expect(screen.getByRole("button", { name: "SQL" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Databases & search" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("opens the group heading too once every Skill is open by hand", () => {
    renderGroup(DATABASES);
    for (const arrow of arrows()) fireEvent.click(arrow);
    expect(screen.getByRole("button", { name: "Databases & search" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("closes the heading again when the last open Skill is closed by hand", () => {
    renderGroup(DATABASES);
    const heading = screen.getByRole("button", { name: "Databases & search" });
    fireEvent.click(heading);
    for (const arrow of arrows()) fireEvent.click(arrow);
    expect(heading).toHaveAttribute("aria-expanded", "false");
    expect(openArrows()).toHaveLength(0);
  });
});
