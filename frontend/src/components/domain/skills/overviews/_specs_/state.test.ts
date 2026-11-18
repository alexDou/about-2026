import { describe, expect, it } from "vitest";
import {
  ALL_CLOSED,
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

/** Frontend-like: Skills of its own and one subgroup. */
const FRONTEND: OverviewGroup = {
  id: "frontend",
  skills: [{ id: "react" }, { id: "vue" }],
  subgroups: [{ id: "ecosystem", skills: [{ id: "css" }, { id: "seo" }] }],
};

const FLAT: OverviewGroup = { id: "testing", skills: [{ id: "jest" }], subgroups: [] };

describe("headingsOf", () => {
  it("gives a group heading every Skill beneath it, its subgroups' included, then each subgroup", () => {
    expect(headingsOf(FRONTEND)).toEqual([
      { id: "frontend", skills: ["react", "vue", "css", "seo"] },
      { id: "ecosystem", skills: ["css", "seo"] },
    ]);
    expect(headingsOf(DATABASES)).toEqual([
      { id: "databases", skills: ["postgres", "sqlite", "redis"] },
      { id: "sql", skills: ["postgres", "sqlite"] },
      { id: "nosql", skills: ["redis"] },
    ]);
    expect(headingsOf(FLAT)).toEqual([{ id: "testing", skills: ["jest"] }]);
  });
});

describe("the start", () => {
  it("has every overview and every heading closed", () => {
    expect(skillOpen(ALL_CLOSED, "react")).toBe(false);
    expect(headingOpen(ALL_CLOSED, "frontend")).toBe(false);
  });
});

describe("skillToggled", () => {
  const headings = headingsOf(FRONTEND);

  it("opens a closed overview and closes an open one", () => {
    const opened = skillToggled(ALL_CLOSED, headings, "react");
    expect(skillOpen(opened, "react")).toBe(true);
    expect(skillOpen(skillToggled(opened, headings, "react"), "react")).toBe(false);
  });

  it("leaves the other overviews alone", () => {
    const opened = skillToggled(ALL_CLOSED, headings, "react");
    expect(skillOpen(opened, "vue")).toBe(false);
  });

  it("leaves the headings' states alone while the Skills beneath them differ", () => {
    const opened = skillToggled(ALL_CLOSED, headings, "react");
    expect(headingOpen(opened, "frontend")).toBe(false);
    expect(headingOpen(opened, "ecosystem")).toBe(false);
  });

  it("opens a heading when its last Skill is opened by hand, and only that heading", () => {
    let state = ALL_CLOSED;
    for (const id of ["css", "seo"]) state = skillToggled(state, headings, id);
    expect(headingOpen(state, "ecosystem")).toBe(true);
    expect(headingOpen(state, "frontend")).toBe(false);
    for (const id of ["react", "vue"]) state = skillToggled(state, headings, id);
    expect(headingOpen(state, "frontend")).toBe(true);
  });

  it("closes a heading when its last open Skill is closed by hand", () => {
    let state = headingToggled(ALL_CLOSED, headings, "frontend");
    expect(headingOpen(state, "frontend")).toBe(true);
    for (const id of ["react", "vue", "css"]) state = skillToggled(state, headings, id);
    // One is still open: both headings keep their state.
    expect(headingOpen(state, "frontend")).toBe(true);
    expect(headingOpen(state, "ecosystem")).toBe(true);
    state = skillToggled(state, headings, "seo");
    expect(headingOpen(state, "ecosystem")).toBe(false);
    expect(headingOpen(state, "frontend")).toBe(false);
  });

  it("keeps an open heading open while one of its Skills is closed by hand", () => {
    let state = headingToggled(ALL_CLOSED, headings, "frontend");
    state = skillToggled(state, headings, "react");
    expect(headingOpen(state, "frontend")).toBe(true);
    expect(headingOpen(state, "ecosystem")).toBe(true);
  });

  it("does not touch another group's state", () => {
    const state = skillToggled(ALL_CLOSED, headingsOf(FLAT), "jest");
    expect(headingOpen(state, "testing")).toBe(true);
    expect(headingOpen(state, "frontend")).toBe(false);
    expect(skillOpen(state, "react")).toBe(false);
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

  it("acts on its own subgroup only", () => {
    const state = headingToggled(ALL_CLOSED, headings, "sql");
    expect(skillOpen(state, "redis")).toBe(false);
    expect(headingOpen(state, "nosql")).toBe(false);
    expect(headingOpen(state, "databases")).toBe(false);
  });

  it("closes every Skill again on the next click", () => {
    const opened = headingToggled(ALL_CLOSED, headings, "sql");
    const closed = headingToggled(opened, headings, "sql");
    expect(skillOpen(closed, "postgres")).toBe(false);
    expect(headingOpen(closed, "sql")).toBe(false);
  });

  it("lets a group heading cover the Skills of every subgroup, and the subgroup headings follow", () => {
    const state = headingToggled(ALL_CLOSED, headings, "databases");
    for (const id of ["postgres", "sqlite", "redis"]) expect(skillOpen(state, id)).toBe(true);
    for (const id of ["databases", "sql", "nosql"]) expect(headingOpen(state, id)).toBe(true);
    const closed = headingToggled(state, headings, "databases");
    for (const id of ["postgres", "sqlite", "redis"]) expect(skillOpen(closed, id)).toBe(false);
    for (const id of ["databases", "sql", "nosql"]) expect(headingOpen(closed, id)).toBe(false);
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
