import { describe, expect, it } from "vitest";
import { arcPath, polygonPath, scallopPath, starPath } from "../utils";

type Point = { x: number; y: number };

/** The vertices of a closed `M x y L x y … Z` path, as numbers. */
function vertices(path: string): Point[] {
  return [...path.matchAll(/[ML]\s*(-?[\d.]+)\s+(-?[\d.]+)/g)].map(([, x, y]) => ({
    x: Number(x),
    y: Number(y),
  }));
}

const distance = (a: Point, from: Point) => Math.hypot(a.x - from.x, a.y - from.y);

describe("polygonPath", () => {
  it("is a closed path of `sides` vertices on the circle, the first straight above the centre", () => {
    const path = polygonPath(60, 60, 50, 6);
    const points = vertices(path);
    expect(points).toHaveLength(6);
    expect(points[0]).toEqual({ x: 60, y: 10 });
    for (const point of points) expect(distance(point, { x: 60, y: 60 })).toBeCloseTo(50, 1);
    expect(path.endsWith("Z")).toBe(true);
  });
});

describe("starPath", () => {
  it("alternates the outer and the inner radius over 2 × points vertices", () => {
    const points = vertices(starPath(60, 60, 50, 30, 5));
    expect(points).toHaveLength(10);
    points.forEach((point, i) => {
      expect(distance(point, { x: 60, y: 60 })).toBeCloseTo(i % 2 === 0 ? 50 : 30, 1);
    });
    expect(points[0]).toEqual({ x: 60, y: 10 });
  });
});

describe("scallopPath", () => {
  it("stays within the radius plus or minus the amplitude and reaches both", () => {
    const radii = vertices(scallopPath(60, 60, 50, 4, 12)).map((p) =>
      distance(p, { x: 60, y: 60 }),
    );
    expect(Math.min(...radii)).toBeCloseTo(46, 0);
    expect(Math.max(...radii)).toBeCloseTo(54, 0);
    expect(Math.min(...radii)).toBeGreaterThanOrEqual(45.9);
    expect(Math.max(...radii)).toBeLessThanOrEqual(54.1);
  });
});

describe("arcPath", () => {
  it("runs left to right over the top, clockwise", () => {
    expect(arcPath(60, 60, 40, "top")).toBe("M 20 60 A 40 40 0 0 1 100 60");
  });

  it("runs left to right under the bottom, counter-clockwise", () => {
    expect(arcPath(60, 60, 40, "bottom")).toBe("M 20 60 A 40 40 0 0 0 100 60");
  });
});
