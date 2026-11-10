import { describe, expect, it } from "vitest";
import { DEFAULT_BOARD, expandedBoard, PANEL_IDS, pathOf } from "..";

describe("PANEL_IDS", () => {
  it("lists the five Panels in Board order", () => {
    expect(PANEL_IDS).toEqual(["about", "whatIDo", "skills", "chatWithMe", "contact"]);
  });
});

describe("pathOf", () => {
  it("gives /explore for the Board with no Panel open", () => {
    expect(pathOf(DEFAULT_BOARD)).toBe("/explore");
  });

  it.each([
    ["about", "/about"],
    ["whatIDo", "/what-i-do"],
    ["skills", "/skills"],
    ["chatWithMe", "/chat"],
    ["contact", "/contact"],
  ] as const)("gives the URL of the Expanded panel %s", (panel, path) => {
    expect(pathOf(expandedBoard(panel))).toBe(path);
  });
});

describe("expandedBoard", () => {
  it("gives the same object for the same Panel, so what compares Boards by identity can tell them apart", () => {
    expect(expandedBoard("skills")).toBe(expandedBoard("skills"));
    expect(expandedBoard("skills")).not.toBe(expandedBoard("about"));
    expect(expandedBoard("skills")).toEqual({ kind: "expanded", panel: "skills" });
  });
});
