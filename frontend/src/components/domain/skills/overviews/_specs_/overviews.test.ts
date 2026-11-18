import { afterEach, describe, expect, it } from "vitest";
import { headingOpen, headingsOf, skillOpen } from "../state";
import { overviews$, reset, toggleHeading, toggleSkill } from "../overviews";

const headings = headingsOf({
  id: "sql-group",
  skills: [{ id: "a" }, { id: "b" }],
  subgroups: [],
});

afterEach(reset);

describe("overviews", () => {
  it("starts with everything closed", () => {
    expect(skillOpen(overviews$.get(), "a")).toBe(false);
    expect(headingOpen(overviews$.get(), "sql-group")).toBe(false);
  });

  it("changes through the Skill's arrow and the heading, as the rules say", () => {
    toggleSkill(headings, "a");
    expect(skillOpen(overviews$.get(), "a")).toBe(true);
    toggleHeading(headings, "sql-group");
    expect(skillOpen(overviews$.get(), "b")).toBe(true);
    expect(headingOpen(overviews$.get(), "sql-group")).toBe(true);
  });

  it("starts from scratch after reset", () => {
    toggleHeading(headings, "sql-group");
    reset();
    expect(skillOpen(overviews$.get(), "a")).toBe(false);
  });
});
