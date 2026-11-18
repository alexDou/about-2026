import { act, fireEvent, render, screen, within } from "@octanejs/testing-library";
import { afterEach, describe, expect, it } from "vitest";
import { intlWrapper } from "../../../../../i18n";
import { reset, toggleSkill } from "../../overviews";
import type { SkillEntrySkill } from "../../skill-entry";
import { SkillGroup } from "../SkillGroup.tsrx";
import type { SkillGroupData } from "../types";

type TestSkillId = "react" | "vue" | "css" | "seo" | "postgresMysql" | "redis" | "mongodb";

const skill = (id: TestSkillId): SkillEntrySkill => ({
  id,
  name: `skills.skill.${id}.name`,
  overview: `skills.skill.${id}.overview`,
  certificates: [],
});

/** Frontend-like: two subgroups, no Skills of its own. */
const FRONTEND = {
  id: "frontend",
  name: "skills.group.frontend.name",
  skills: [],
  subgroups: [
    {
      id: "frameworksLibraries",
      name: "skills.subgroup.frameworksLibraries.name",
      skills: [skill("react"), skill("vue")],
    },
    {
      id: "architectureEcosystem",
      name: "skills.subgroup.architectureEcosystem.name",
      skills: [skill("css"), skill("seo")],
    },
  ],
} satisfies SkillGroupData;

/** Testing-like: a plain list, no subgroups. */
const FLAT = {
  id: "testing",
  name: "skills.group.testing.name",
  skills: [skill("postgresMysql"), skill("redis")],
  subgroups: [],
} satisfies SkillGroupData;

const renderGroup = (group: SkillGroupData) =>
  render(SkillGroup, { props: { group }, wrapper: intlWrapper() });

const toggle = () => screen.getByRole("button", { name: /^(Frontend|Testing & quality)$/ });
const arrows = () => screen.getAllByRole("button", { name: /^Overview of / });
const openArrows = () => arrows().filter((a) => a.getAttribute("aria-expanded") === "true");

afterEach(reset);

describe("SkillGroup", () => {
  it("is a section whose heading is a button named by the group, closed at first", () => {
    const { container } = renderGroup(FRONTEND);
    expect(container.firstElementChild?.tagName).toBe("SECTION");
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toContainElement(toggle());
    expect(toggle()).toHaveAttribute("type", "button");
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps what is inside out of reach while closed, and points the button at it", () => {
    renderGroup(FRONTEND);
    const panel = document.getElementById(toggle().getAttribute("aria-controls") ?? "");
    expect(panel).toHaveAttribute("inert");
    expect(panel).toContainElement(screen.getByText("React"));
  });

  it("opens on a click: the group shows, with every overview and every subgroup open", () => {
    renderGroup(FRONTEND);
    fireEvent.click(toggle());
    expect(toggle()).toHaveAttribute("aria-expanded", "true");
    const panel = document.getElementById(toggle().getAttribute("aria-controls") ?? "");
    expect(panel).not.toHaveAttribute("inert");
    expect(openArrows()).toHaveLength(4);
    for (const name of ["Frameworks & libraries", "Architecture & ecosystem"]) {
      expect(screen.getByRole("button", { name })).toHaveAttribute("aria-expanded", "true");
    }
  });

  it("closes on the next click, with every overview and subgroup", () => {
    renderGroup(FRONTEND);
    fireEvent.click(toggle());
    fireEvent.click(toggle());
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
    expect(openArrows()).toHaveLength(0);
    expect(screen.getByRole("button", { name: "Architecture & ecosystem" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("shows its subgroups, each with its heading and its Skills in order", () => {
    renderGroup(FRONTEND);
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Frameworks & libraries",
      "Architecture & ecosystem",
    ]);
    const first = screen.getByRole("heading", { level: 3, name: "Frameworks & libraries" });
    const subgroup = first.closest("section")!;
    expect(within(subgroup).getAllByRole("listitem")).toHaveLength(2);
    expect(within(subgroup).getByText("Vue")).toBeInTheDocument();
  });

  it("lists the Skills of a group with no subgroups directly, with no subgroup heading", () => {
    renderGroup(FLAT);
    expect(screen.queryAllByRole("heading", { level: 3 })).toHaveLength(0);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    fireEvent.click(toggle());
    expect(openArrows()).toHaveLength(2);
  });

  it("lets a subgroup heading act on its own Skills only, leaving the group as it is", () => {
    renderGroup(FRONTEND);
    fireEvent.click(screen.getByRole("button", { name: "Architecture & ecosystem" }));
    expect(openArrows().map((a) => a.getAttribute("aria-label"))).toEqual([
      "Overview of CSS",
      "Overview of SEO",
    ]);
    expect(screen.getByRole("button", { name: "Frameworks & libraries" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the subgroup heading once every Skill in it is opened by hand", () => {
    renderGroup(FRONTEND);
    fireEvent.click(screen.getByRole("button", { name: "Overview of React" }));
    const heading = screen.getByRole("button", { name: "Frameworks & libraries" });
    expect(heading).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(screen.getByRole("button", { name: "Overview of Vue" }));
    expect(heading).toHaveAttribute("aria-expanded", "true");
  });

  it("stays open when every overview in it is closed by hand", () => {
    renderGroup(FRONTEND);
    fireEvent.click(toggle());
    for (const arrow of arrows()) fireEvent.click(arrow);
    expect(openArrows()).toHaveLength(0);
    expect(toggle()).toHaveAttribute("aria-expanded", "true");
  });

  it("follows the shared state, so an overview opened elsewhere shows open", () => {
    renderGroup(FRONTEND);
    act(() => toggleSkill([{ id: "frameworksLibraries", skills: ["react", "vue"] }], "react"));
    expect(screen.getByRole("button", { name: "Overview of React" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });
});
