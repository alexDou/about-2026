import { afterEach, describe, expect, it } from "vitest";
import { groupOpen, headingOpen, headingsOf, skillOpen } from "../state";
import { overviews$, reset, setAll, toggleGroup, toggleHeading, toggleSkill } from "../overviews";

const GROUP = {
  id: "databases",
  skills: [],
  subgroups: [{ id: "sql", skills: [{ id: "a" }, { id: "b" }] }],
};
const headings = headingsOf(GROUP);

afterEach(reset);

describe("overviews", () => {
  it("starts with everything closed", () => {
    expect(groupOpen(overviews$.get(), "databases")).toBe(false);
    expect(headingOpen(overviews$.get(), "sql")).toBe(false);
    expect(skillOpen(overviews$.get(), "a")).toBe(false);
  });

  it("changes through the Skill's arrow, the subgroup heading and the group, as the rules say", () => {
    toggleSkill(headings, "a");
    expect(skillOpen(overviews$.get(), "a")).toBe(true);
    toggleHeading(headings, "sql");
    expect(skillOpen(overviews$.get(), "b")).toBe(true);
    expect(headingOpen(overviews$.get(), "sql")).toBe(true);
    toggleGroup(GROUP);
    expect(groupOpen(overviews$.get(), "databases")).toBe(true);
  });

  it("opens and closes everything at once with setAll", () => {
    setAll([GROUP], true);
    expect(groupOpen(overviews$.get(), "databases")).toBe(true);
    expect(skillOpen(overviews$.get(), "b")).toBe(true);
    expect(headingOpen(overviews$.get(), "sql")).toBe(true);
    setAll([GROUP], false);
    expect(groupOpen(overviews$.get(), "databases")).toBe(false);
    expect(skillOpen(overviews$.get(), "b")).toBe(false);
  });

  it("starts from scratch after reset", () => {
    toggleGroup(GROUP);
    reset();
    expect(groupOpen(overviews$.get(), "databases")).toBe(false);
    expect(skillOpen(overviews$.get(), "a")).toBe(false);
  });
});
