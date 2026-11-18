import { describe, expect, it } from "vitest";
import {
  ALL_CLOSED,
  groupOpen,
  groupToggled,
  headingOpen,
  headingToggled,
  headingsOf,
  skillOpen,
  skillToggled,
} from "../state";
import type { OverviewGroup } from "../types";

/** Databases-like: no Skills of its own, two subgroups. */
const DATABASES: OverviewGroup = {
  id: "databases",
  skills: [],
  subgroups: [
    { id: "sql", skills: [{ id: "postgres" }, { id: "sqlite" }] },
    { id: "nosql", skills: [{ id: "redis" }] },
  ],
};

/** Testing-like: a plain list of Skills, no subgroups. */
const FLAT: OverviewGroup = {
  id: "testing",
  skills: [{ id: "jest" }, { id: "pytest" }],
  subgroups: [],
};

/** A group that mixes both, which the content does not have but the rules must still survive. */
const MIXED: OverviewGroup = {
  id: "frontend",
  skills: [{ id: "react" }],
  subgroups: [{ id: "ecosystem", skills: [{ id: "css" }, { id: "seo" }] }],
};

describe("headingsOf", () => {
  it("gives each subgroup a heading over its own Skills, and a group none", () => {
    expect(headingsOf(DATABASES)).toEqual([
      { id: "sql", skills: ["postgres", "sqlite"] },
      { id: "nosql", skills: ["redis"] },
    ]);
    expect(headingsOf(FLAT)).toEqual([]);
    expect(headingsOf(MIXED)).toEqual([{ id: "ecosystem", skills: ["css", "seo"] }]);
  });
});

describe("the start", () => {
  it("has every group, heading and overview closed", () => {
    expect(groupOpen(ALL_CLOSED, "databases")).toBe(false);
    expect(headingOpen(ALL_CLOSED, "sql")).toBe(false);
    expect(skillOpen(ALL_CLOSED, "postgres")).toBe(false);
  });
});

describe("groupToggled", () => {
  it("opens the group, every overview in it and every subgroup heading", () => {
    const state = groupToggled(ALL_CLOSED, DATABASES);
    expect(groupOpen(state, "databases")).toBe(true);
    for (const id of ["postgres", "sqlite", "redis"]) expect(skillOpen(state, id)).toBe(true);
    for (const id of ["sql", "nosql"]) expect(headingOpen(state, id)).toBe(true);
  });

  it("closes the group, every overview and every subgroup heading on the next click", () => {
    const closed = groupToggled(groupToggled(ALL_CLOSED, DATABASES), DATABASES);
    expect(groupOpen(closed, "databases")).toBe(false);
    for (const id of ["postgres", "sqlite", "redis"]) expect(skillOpen(closed, id)).toBe(false);
    for (const id of ["sql", "nosql"]) expect(headingOpen(closed, id)).toBe(false);
  });

  it("opens the Skills of a group with no subgroups", () => {
    const state = groupToggled(ALL_CLOSED, FLAT);
    expect(groupOpen(state, "testing")).toBe(true);
    expect(skillOpen(state, "jest")).toBe(true);
    expect(skillOpen(state, "pytest")).toBe(true);
  });

  it("acts on its own group only", () => {
    const state = groupToggled(ALL_CLOSED, FLAT);
    expect(groupOpen(state, "databases")).toBe(false);
    expect(skillOpen(state, "postgres")).toBe(false);
  });

  it("opens a closed group that has some overviews open by hand, all of them", () => {
    const some = skillToggled(ALL_CLOSED, headingsOf(DATABASES), "postgres");
    expect(groupOpen(some, "databases")).toBe(false);
    const state = groupToggled(some, DATABASES);
    expect(skillOpen(state, "sqlite")).toBe(true);
    expect(groupOpen(state, "databases")).toBe(true);
  });

  it("keeps the group's own Skills with a subgroup's in a mixed group", () => {
    const state = groupToggled(ALL_CLOSED, MIXED);
    for (const id of ["react", "css", "seo"]) expect(skillOpen(state, id)).toBe(true);
    expect(headingOpen(state, "ecosystem")).toBe(true);
  });
});

describe("a group's state is whether it shows", () => {
  const headings = headingsOf(DATABASES);

  it("stays open when every overview in it is closed by hand", () => {
    let state = groupToggled(ALL_CLOSED, DATABASES);
    for (const id of ["postgres", "sqlite", "redis"]) state = skillToggled(state, headings, id);
    expect(groupOpen(state, "databases")).toBe(true);
  });

  it("stays closed when every overview in it is opened by hand", () => {
    let state = ALL_CLOSED;
    for (const id of ["postgres", "sqlite", "redis"]) state = skillToggled(state, headings, id);
    expect(groupOpen(state, "databases")).toBe(false);
  });
});

describe("skillToggled", () => {
  const headings = headingsOf(MIXED);

  it("opens a closed overview and closes an open one", () => {
    const opened = skillToggled(ALL_CLOSED, headings, "react");
    expect(skillOpen(opened, "react")).toBe(true);
    expect(skillOpen(skillToggled(opened, headings, "react"), "react")).toBe(false);
  });

  it("leaves the other overviews and the headings alone while the Skills beneath differ", () => {
    const opened = skillToggled(ALL_CLOSED, headings, "css");
    expect(skillOpen(opened, "seo")).toBe(false);
    expect(headingOpen(opened, "ecosystem")).toBe(false);
  });

  it("opens a subgroup heading when its last Skill is opened by hand", () => {
    let state = ALL_CLOSED;
    for (const id of ["css", "seo"]) state = skillToggled(state, headings, id);
    expect(headingOpen(state, "ecosystem")).toBe(true);
  });

  it("closes a subgroup heading when its last open Skill is closed by hand", () => {
    let state = groupToggled(ALL_CLOSED, MIXED);
    state = skillToggled(state, headings, "css");
    // One is still open: the heading keeps its state.
    expect(headingOpen(state, "ecosystem")).toBe(true);
    state = skillToggled(state, headings, "seo");
    expect(headingOpen(state, "ecosystem")).toBe(false);
  });

  it("keeps an open heading open while one of its Skills is closed by hand", () => {
    const state = skillToggled(headingToggled(ALL_CLOSED, headings, "ecosystem"), headings, "css");
    expect(headingOpen(state, "ecosystem")).toBe(true);
  });
});

describe("headingToggled", () => {
  const headings = headingsOf(DATABASES);

  it("opens every Skill beneath a closed heading and the heading with them", () => {
    const state = headingToggled(ALL_CLOSED, headings, "sql");
    expect(skillOpen(state, "postgres")).toBe(true);
    expect(skillOpen(state, "sqlite")).toBe(true);
    expect(headingOpen(state, "sql")).toBe(true);
  });

  it("acts on its own subgroup only, and leaves the group's state alone", () => {
    const state = headingToggled(ALL_CLOSED, headings, "sql");
    expect(skillOpen(state, "redis")).toBe(false);
    expect(headingOpen(state, "nosql")).toBe(false);
    expect(groupOpen(state, "databases")).toBe(false);
  });

  it("closes every Skill again on the next click", () => {
    const closed = headingToggled(headingToggled(ALL_CLOSED, headings, "sql"), headings, "sql");
    expect(skillOpen(closed, "postgres")).toBe(false);
    expect(headingOpen(closed, "sql")).toBe(false);
  });

  it("opens the rest when some are open by hand: a closed heading's click always opens", () => {
    const some = skillToggled(ALL_CLOSED, headings, "postgres");
    expect(headingOpen(some, "sql")).toBe(false);
    const state = headingToggled(some, headings, "sql");
    expect(skillOpen(state, "sqlite")).toBe(true);
    expect(headingOpen(state, "sql")).toBe(true);
  });

  it("closes all when the heading is open and some were closed by hand", () => {
    let state = headingToggled(ALL_CLOSED, headings, "sql");
    state = skillToggled(state, headings, "postgres");
    expect(headingOpen(state, "sql")).toBe(true);
    state = headingToggled(state, headings, "sql");
    expect(skillOpen(state, "sqlite")).toBe(false);
    expect(headingOpen(state, "sql")).toBe(false);
  });

  it("changes nothing for a heading it does not know", () => {
    expect(headingToggled(ALL_CLOSED, headings, "nope")).toBe(ALL_CLOSED);
  });
});
