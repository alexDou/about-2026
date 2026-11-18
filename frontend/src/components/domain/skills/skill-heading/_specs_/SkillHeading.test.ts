import { act, fireEvent, render, screen } from "@octanejs/testing-library";
import { afterEach, describe, expect, it } from "vitest";
import { intlWrapper } from "../../../../../i18n";
import { headingOpen, headingsOf, overviews$, reset, toggleSkill } from "../../overviews";
import { SKILL_HEADING_LEVELS } from "../config";
import { SkillHeading } from "../SkillHeading.tsrx";
import type { SkillHeadingLevel } from "../types";

const GROUP = {
  id: "programming",
  skills: [{ id: "typescript" }, { id: "python" }],
  subgroups: [],
};

function setup(level: SkillHeadingLevel = SKILL_HEADING_LEVELS.group) {
  return render(SkillHeading, {
    props: {
      id: "programming",
      name: "skills.group.programming.name",
      level,
      headings: headingsOf(GROUP),
    },
    wrapper: intlWrapper(),
  });
}

afterEach(reset);

describe("SkillHeading", () => {
  it("is a heading of the given level named by the group, holding a button", () => {
    setup();
    const heading = screen.getByRole("heading", { level: 2, name: "Programming languages" });
    expect(heading).toContainElement(screen.getByRole("button"));
  });

  it("takes a subgroup's level", () => {
    setup(SKILL_HEADING_LEVELS.subgroup);
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });

  it("is closed at first, and a click opens it and then closes it again", () => {
    setup();
    const button = screen.getByRole("button", { name: "Programming languages" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(headingOpen(overviews$.get(), "programming")).toBe(true);
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("follows the Skills opened by hand, by the heading rule", () => {
    setup();
    const button = screen.getByRole("button", { name: "Programming languages" });
    act(() => toggleSkill(headingsOf(GROUP), "typescript"));
    expect(button).toHaveAttribute("aria-expanded", "false");
    act(() => toggleSkill(headingsOf(GROUP), "python"));
    expect(button).toHaveAttribute("aria-expanded", "true");
  });
});
