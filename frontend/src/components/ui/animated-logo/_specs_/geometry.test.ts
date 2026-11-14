import { describe, expect, it } from "vitest";
import { WEAVE_SETTINGS } from "../config";
import { lineClipPath, linePath, ringClipPath, ringPath, toneOf } from "../geometry";

const { ring, line } = WEAVE_SETTINGS;
const coords = (d: string) => [...d.matchAll(/-?\d+\.?\d*/g)].map((m) => Number(m[0]));

describe("logo geometry", () => {
  it("draws each ring layer as a closed path inside the O band", () => {
    const d = ringPath(ring, 0, 0);
    expect(d.startsWith("M")).toBe(true);
    expect(d.endsWith("Z")).toBe(true);
    expect(coords(d).every(Number.isFinite)).toBe(true);
  });

  it("changes the weave as the phase advances", () => {
    expect(ringPath(ring, 3, 0)).not.toBe(ringPath(ring, 3, 1));
    expect(linePath(line, 3, 0)).not.toBe(linePath(line, 3, 1));
  });

  it("draws an open line path with finite points", () => {
    const d = linePath(line, 0, 0);
    expect(d.startsWith("M")).toBe(true);
    expect(d.endsWith("Z")).toBe(false);
    expect(coords(d).every(Number.isFinite)).toBe(true);
  });

  it("builds closed clip shapes", () => {
    expect(ringClipPath(ring.thickness)).toMatch(/Z$/);
    expect(lineClipPath(line.thickness)).toMatch(/^M.*A.*A.*Z$/);
  });

  it("splits layers evenly into three tones", () => {
    const tones = Array.from({ length: 33 }, (_, i) => toneOf(i, 33, 3));
    expect(new Set(tones)).toEqual(new Set([1, 2, 3]));
    expect(tones.filter((t) => t === 1)).toHaveLength(11);
  });
});
