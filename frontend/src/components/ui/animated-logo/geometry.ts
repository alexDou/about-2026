// Weave geometry for the animated "a" logo, adapted from Loop Lab's pathData().
// All coordinates are in source-image px (see VIEW_BOX in config.ts).
import { SEGMENT_TYPES } from "./config";
import type { LineWeave, RingWeave } from "./types";

type LineSegment = {
  type: typeof SEGMENT_TYPES.line;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  len: number;
};
type ArcSegment = {
  type: typeof SEGMENT_TYPES.arc;
  cx: number;
  cy: number;
  r: number;
  a0: number;
  a1: number;
  len: number;
};
type Segment = LineSegment | ArcSegment;
type Point = { x: number; y: number; tx: number; ty: number };

/** The O: center and mid-band radius. */
const O = { cx: 306, cy: 306, rMid: 84.5 } as const;

const line = (x0: number, y0: number, x1: number, y1: number): LineSegment => ({
  type: SEGMENT_TYPES.line,
  x0,
  y0,
  x1,
  y1,
  len: Math.hypot(x1 - x0, y1 - y0),
});
const arc = (cx: number, cy: number, r: number, a0: number, a1: number): ArcSegment => ({
  type: SEGMENT_TYPES.arc,
  cx,
  cy,
  r,
  a0,
  a1,
  len: Math.abs(a1 - a0) * r,
});

/** Curved line centerline: M190,159.5 H407 A45.5 → 452.5,205 V346 A44.5 → 497,390.5 H544 */
const SEGMENTS: readonly Segment[] = [
  line(190, 159.5, 407, 159.5),
  arc(407, 205, 45.5, -Math.PI / 2, 0),
  line(452.5, 205, 452.5, 346),
  arc(497, 346, 44.5, Math.PI, Math.PI / 2),
  line(497, 390.5, 544, 390.5),
];
const LINE_LEN = SEGMENTS.reduce((sum, s) => sum + s.len, 0);
const LAST_SEGMENT = SEGMENTS[SEGMENTS.length - 1];

const fmt = (n: number) => n.toFixed(2);

/** Point and unit tangent on the centerline at arc length `s` (extrapolates past both ends). */
function centerline(s: number): Point {
  let rest = Math.max(0, Math.min(s, LINE_LEN));
  for (const seg of SEGMENTS) {
    if (rest <= seg.len || seg === LAST_SEGMENT) {
      let x: number, y: number, tx: number, ty: number;
      if (seg.type === SEGMENT_TYPES.line) {
        tx = (seg.x1 - seg.x0) / seg.len;
        ty = (seg.y1 - seg.y0) / seg.len;
        x = seg.x0 + tx * rest;
        y = seg.y0 + ty * rest;
      } else {
        const dir = Math.sign(seg.a1 - seg.a0);
        const a = seg.a0 + (dir * rest) / seg.r;
        x = seg.cx + seg.r * Math.cos(a);
        y = seg.cy + seg.r * Math.sin(a);
        tx = -Math.sin(a) * dir;
        ty = Math.cos(a) * dir;
      }
      const over = s < 0 ? s : s > LINE_LEN ? s - LINE_LEN : 0;
      return { x: x + tx * over, y: y + ty * over, tx, ty };
    }
    rest -= seg.len;
  }
  throw new Error("unreachable: centerline has no segments");
}

/** Loop Lab radius band: base 165..193 ± spread·1.45, later mapped onto the band thickness. */
function band(spread: number) {
  const amp = spread * 1.45;
  return { amp, lo: 165 - amp, hi: 193 + amp };
}

function layerTwist(layer: number, weave: number, phase: number) {
  const offset = layer / weave;
  return { base: 165 + offset * 28, twist: offset * Math.PI * 2 + phase };
}

/** One woven line of the O (a closed rosette, radius remapped into the ring band). */
export function ringPath(cfg: RingWeave, layer: number, phase: number): string {
  const { amp, lo, hi } = band(cfg.spread);
  const { base, twist } = layerTwist(layer, cfg.weave, phase);
  const rIn = O.rMid - cfg.thickness / 2;
  const count = 540;
  const d: string[] = [];
  for (let i = 0; i <= count; i++) {
    const t = (i / count) * Math.PI * 2;
    const r0 = base + amp * Math.cos(cfg.petals * t + twist);
    const r = rIn + ((r0 - lo) / (hi - lo)) * cfg.thickness;
    const angle = t + cfg.wobble * Math.sin(cfg.petals * t - twist);
    d.push(`${i ? "L" : "M"}${fmt(O.cx + r * Math.cos(angle))},${fmt(O.cy + r * Math.sin(angle))}`);
  }
  return `${d.join("")}Z`;
}

/** One woven line of the curved stroke: the same weave unrolled along the centerline. */
export function linePath(cfg: LineWeave, layer: number, phase: number): string {
  const { amp, lo, hi } = band(cfg.spread);
  const { base, twist } = layerTwist(layer, cfg.weave, phase);
  const k = (2 * Math.PI) / cfg.wavelength;
  const sway = cfg.wobble * O.rMid * 0.5;
  // Sample past both ends far enough to fill the round caps; the clip trims the rest.
  const pad = cfg.thickness / 2 + sway + 6;
  const d: string[] = [];
  for (let u = -pad; u <= LINE_LEN + pad; u += 1.2) {
    const s = u + sway * Math.sin(k * u - twist);
    const r0 = base + amp * Math.cos(k * u + twist);
    const n = ((r0 - lo) / (hi - lo)) * cfg.thickness - cfg.thickness / 2;
    const p = centerline(s);
    d.push(`${d.length ? "L" : "M"}${fmt(p.x - p.ty * n)},${fmt(p.y + p.tx * n)}`);
  }
  return d.join("");
}

const circle = (r: number) =>
  `M${O.cx - r},${O.cy}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0Z`;

/** Annulus clipping the O to its band (use with clip-rule="evenodd"). */
export function ringClipPath(thickness: number): string {
  const half = thickness / 2;
  return circle(O.rMid + half) + circle(Math.max(1, O.rMid - half));
}

const edge = (points: string[]) =>
  points
    .slice(1)
    .map((p) => `L${p}`)
    .join("");

/** Outline of the curved stroke with round caps at both ends. */
export function lineClipPath(thickness: number): string {
  const half = thickness / 2;
  const left: string[] = [];
  const right: string[] = [];
  for (let s = 0; s <= LINE_LEN; s += 1) {
    const p = centerline(s);
    left.push(`${fmt(p.x - p.ty * half)},${fmt(p.y + p.tx * half)}`);
    right.push(`${fmt(p.x + p.ty * half)},${fmt(p.y - p.tx * half)}`);
  }
  right.reverse();
  const cap = (to: string | undefined) => `A${half},${half} 0 0 0 ${to}`;
  return `M${left[0]}${edge(left)}${cap(right[0])}${edge(right)}${cap(left[0])}Z`;
}

/** Which color tone (1..tones) a layer uses. */
export function toneOf(layer: number, weave: number, tones: number): number {
  return 1 + Math.floor((layer / weave) * tones);
}
