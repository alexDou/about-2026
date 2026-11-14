import { describe, expect, it } from "vitest";
import { DEFAULT_BOARD, expandedBoard } from "../../../../hooks/use-route";
import { changeKind, transitionTypes } from "../utils";

describe("changeKind", () => {
  it("is an open from the default Board to an Expanded panel", () => {
    expect(changeKind(DEFAULT_BOARD, expandedBoard("skills"))).toBe("open");
  });

  it("is a close from an Expanded panel to the default Board", () => {
    expect(changeKind(expandedBoard("skills"), DEFAULT_BOARD)).toBe("close");
  });

  it("is a switch from one Expanded panel to another", () => {
    expect(changeKind(expandedBoard("skills"), expandedBoard("contact"))).toBe("switch");
  });

  it("is nothing when the Board stays", () => {
    expect(changeKind(DEFAULT_BOARD, DEFAULT_BOARD)).toBeNull();
  });
});

describe("transitionTypes", () => {
  it("names the kind of change", () => {
    expect(transitionTypes(DEFAULT_BOARD, expandedBoard("skills"))).toEqual(["open"]);
    expect(transitionTypes(expandedBoard("skills"), DEFAULT_BOARD)).toEqual(["close"]);
    expect(transitionTypes(expandedBoard("skills"), expandedBoard("about"))).toEqual(["switch"]);
  });

  it("starts no View Transition to or from a screen with no Board, or when the Board stays", () => {
    expect(transitionTypes(null, DEFAULT_BOARD)).toBe(false);
    expect(transitionTypes(DEFAULT_BOARD, null)).toBe(false);
    expect(transitionTypes(DEFAULT_BOARD, DEFAULT_BOARD)).toBe(false);
  });
});
