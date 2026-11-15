import { describe, expect, it } from "vitest";
import { exploreAt, DEFAULT_EXPLORE, expandedExplore, PANEL_IDS, pathOf } from "..";

describe("PANEL_IDS", () => {
  it("lists the five Panels in Explore order", () => {
    expect(PANEL_IDS).toEqual(["about", "whatIDo", "skills", "chatWithMe", "contact"]);
  });
});

describe("pathOf", () => {
  it("gives /explore for Explore with no Panel open", () => {
    expect(pathOf(DEFAULT_EXPLORE)).toBe("/explore");
  });

  it.each([
    ["about", "/about"],
    ["whatIDo", "/what-i-do"],
    ["skills", "/skills"],
    ["chatWithMe", "/chat"],
    ["contact", "/contact"],
  ] as const)("gives the URL of the Expanded panel %s", (panel, path) => {
    expect(pathOf(expandedExplore(panel))).toBe(path);
  });
});

describe("expandedExplore", () => {
  it("gives the same object for the same Panel, so what compares Explore states by identity can tell them apart", () => {
    expect(expandedExplore("skills")).toBe(expandedExplore("skills"));
    expect(expandedExplore("skills")).not.toBe(expandedExplore("about"));
    expect(expandedExplore("skills")).toEqual({ kind: "expanded", panel: "skills" });
  });
});

describe("exploreAt", () => {
  it("is Explore state an Explore URL shows", () => {
    expect(exploreAt("/explore")).toBe(DEFAULT_EXPLORE);
    expect(exploreAt("/what-i-do")).toBe(expandedExplore("whatIDo"));
  });

  it("is null for a URL that shows no Explore, or none at all", () => {
    expect(exploreAt("/")).toBeNull();
    expect(exploreAt(undefined)).toBeNull();
  });
});
