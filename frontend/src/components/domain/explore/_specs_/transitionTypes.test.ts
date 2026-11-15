import { describe, expect, it } from "vitest";
import { DEFAULT_EXPLORE, expandedExplore } from "../../../../hooks/use-route";
import { changeKind, transitionTypes } from "../utils";

describe("changeKind", () => {
  it("is an open from the default Explore to an Expanded panel", () => {
    expect(changeKind(DEFAULT_EXPLORE, expandedExplore("skills"))).toBe("open");
  });

  it("is a close from an Expanded panel to the default Explore", () => {
    expect(changeKind(expandedExplore("skills"), DEFAULT_EXPLORE)).toBe("close");
  });

  it("is a switch from one Expanded panel to another", () => {
    expect(changeKind(expandedExplore("skills"), expandedExplore("contact"))).toBe("switch");
  });

  it("is nothing when Explore stays", () => {
    expect(changeKind(DEFAULT_EXPLORE, DEFAULT_EXPLORE)).toBeNull();
  });
});

describe("transitionTypes", () => {
  it("names the kind of change", () => {
    expect(transitionTypes(DEFAULT_EXPLORE, expandedExplore("skills"))).toEqual(["open"]);
    expect(transitionTypes(expandedExplore("skills"), DEFAULT_EXPLORE)).toEqual(["close"]);
    expect(transitionTypes(expandedExplore("skills"), expandedExplore("about"))).toEqual([
      "switch",
    ]);
  });

  it("starts no View Transition to or from a screen with no Explore, or when Explore stays", () => {
    expect(transitionTypes(null, DEFAULT_EXPLORE)).toBe(false);
    expect(transitionTypes(DEFAULT_EXPLORE, null)).toBe(false);
    expect(transitionTypes(DEFAULT_EXPLORE, DEFAULT_EXPLORE)).toBe(false);
  });
});
