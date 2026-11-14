// @vitest-environment node
import { existsSync, readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";

const chunk = (path: string) => new URL(`../${path}`, import.meta.url);
const bytes = (path: string) => readFileSync(chunk(path));
const text = (path: string) => readFileSync(chunk(path), "utf8");
const size = (path: string) => statSync(chunk(path)).size;

/** The cut-out the photo is made from (`support_files/about/me.png`). */
const SOURCE = { width: 1079, height: 1457 } as const;
const PHOTO_WIDTHS = [400, 800] as const;
const PHOTO_FORMATS = ["avif", "webp"] as const;

/** Byte budgets: the shipped size plus about a quarter, so a 2x regression fails. */
const BUDGET_BYTES = {
  "media/me-400.avif": 12_000,
  "media/me-400.webp": 20_000,
  "media/me-800.avif": 36_000,
  "media/me-800.webp": 70_000,
  "media/nodes.svg": 14_000,
  "media/brush.svg": 3_000,
} as const;

/** Canvas size of an alpha WebP (VP8X chunk) or an AVIF (its `ispe` box). */
function dimensions(file: Buffer): { width: number; height: number } {
  if (file.toString("ascii", 0, 4) === "RIFF") {
    return { width: 1 + file.readUIntLE(24, 3), height: 1 + file.readUIntLE(27, 3) };
  }
  const ispe = file.indexOf("ispe");
  return { width: file.readUInt32BE(ispe + 8), height: file.readUInt32BE(ispe + 12) };
}

describe("About photo", () => {
  const files = PHOTO_WIDTHS.flatMap((width) =>
    PHOTO_FORMATS.map((format) => ({ width, format, path: `media/me-${width}.${format}` })),
  );

  it.each(files)("$path is $width px wide, in the source's aspect ratio", ({ width, path }) => {
    const dims = dimensions(bytes(path));
    expect(dims.width).toBe(width);
    expect(dims.height).toBe(Math.round((width * SOURCE.height) / SOURCE.width));
  });

  it.each(files.filter((f) => f.format === "webp"))(
    "$path keeps its transparency (VP8X, alpha flag 0x10)",
    ({ path }) => {
      const file = bytes(path);
      expect(file.toString("ascii", 12, 16)).toBe("VP8X");
      expect(file[20]! & 0x10).toBe(0x10);
    },
  );

  it.each(files.filter((f) => f.format === "avif"))(
    "$path keeps its transparency (an alpha auxiliary image)",
    ({ path }) => {
      expect(bytes(path).toString("latin1")).toContain(
        "urn:mpeg:mpegB:cicp:systems:auxiliary:alpha",
      );
    },
  );

  it.each(files)("$path stays within its byte budget", ({ path }) => {
    expect(size(path)).toBeLessThan(BUDGET_BYTES[path as keyof typeof BUDGET_BYTES]);
  });
});

describe("Brush stroke", () => {
  const BRUSH = "media/brush.svg";

  it("is an SVG within its byte budget, with its licence beside it", () => {
    expect(text(BRUSH)).toMatch(/^<svg\b/);
    expect(size(BRUSH)).toBeLessThan(BUDGET_BYTES[BRUSH]);
    expect(existsSync(chunk("media/brush.LICENSE.txt"))).toBe(true);
  });

  it("is recolourable: no fixed fill, so CSS (currentColor) decides", () => {
    const svg = text(BRUSH);
    expect(svg).toContain('fill="currentColor"');
    expect(svg).not.toMatch(/fill="(?!none|currentColor)[^"]+"/);
    expect(svg).not.toMatch(/fill:\s*#/);
  });
});

describe("Node burst", () => {
  const NODES = "media/nodes.svg";

  it("is a square SVG within its byte budget, sized by CSS (a viewBox, no width/height)", () => {
    const svg = text(NODES);
    expect(svg).toMatch(/viewBox="0 0 600 600"/);
    expect(svg).not.toMatch(/<svg[^>]*\s(?:width|height)=/);
    expect(size(NODES)).toBeLessThan(BUDGET_BYTES[NODES]);
  });

  it("is greyed out: every colour is a grey", () => {
    const colours = [...text(NODES).matchAll(/(?:fill|stroke)="(#[0-9a-f]{6})"/gi)].map(
      (m) => m[1]!,
    );
    expect(colours.length).toBeGreaterThan(0);
    for (const colour of colours) {
      const [r, g, b] = [1, 3, 5].map((i) => colour.slice(i, i + 2));
      expect(r).toBe(g);
      expect(g).toBe(b);
    }
  });
});
