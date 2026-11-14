import { ARC_SIDES } from "./config";
import type { ArcSide } from "./types";

/** Coordinates without float noise: two decimals, trailing zeros dropped. */
const round = (value: number) => Number(value.toFixed(2));

/** A closed path through one vertex per radius, evenly spaced, the first straight above the centre. */
function ringPath(cx: number, cy: number, radii: readonly number[]): string {
  const points = radii.map((radius, i) => {
    const angle = (2 * Math.PI * i) / radii.length;
    return `${round(cx + radius * Math.sin(angle))} ${round(cy - radius * Math.cos(angle))}`;
  });
  return `M ${points.join(" L ")} Z`;
}

/** A regular polygon of `sides` vertices. */
export function polygonPath(cx: number, cy: number, radius: number, sides: number): string {
  return ringPath(cx, cy, Array<number>(sides).fill(radius));
}

/** A star: `points` tips at `outer`, with the notches between them at `inner`. */
export function starPath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  points: number,
): string {
  return ringPath(
    cx,
    cy,
    Array.from({ length: 2 * points }, (_, i) => (i % 2 === 0 ? outer : inner)),
  );
}

/** Samples around a scalloped edge: enough that a lobe reads as a curve. */
const SCALLOP_STEPS_PER_LOBE = 12;

/** A circle with `lobes` soft bumps, the edge swinging `amplitude` either side of `radius`. */
export function scallopPath(
  cx: number,
  cy: number,
  radius: number,
  amplitude: number,
  lobes: number,
): string {
  const steps = lobes * SCALLOP_STEPS_PER_LOBE;
  return ringPath(
    cx,
    cy,
    Array.from(
      { length: steps },
      (_, i) => radius + amplitude * Math.cos((2 * Math.PI * lobes * i) / steps),
    ),
  );
}

/**
 * A half circle for text to run along, always left to right: over the top clockwise, under the
 * bottom counter-clockwise.
 */
export function arcPath(cx: number, cy: number, radius: number, side: ArcSide): string {
  const sweep = side === ARC_SIDES.top ? 1 : 0;
  return `M ${round(cx - radius)} ${cy} A ${radius} ${radius} 0 0 ${sweep} ${round(cx + radius)} ${cy}`;
}
