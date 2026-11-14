// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const chunk = (path: string) => new URL(`../${path}`, import.meta.url);
const text = (path: string) => readFileSync(chunk(path), "utf8");

const MASK = "media/photo-mask.svg";

describe("Photo mask", () => {
  it("is an SVG that stretches to the photo, with its licence beside it", () => {
    expect(text(MASK)).toMatch(/^<svg\b[^>]*preserveAspectRatio="none"/);
    expect(existsSync(chunk("media/photo-mask.LICENSE.txt"))).toBe(true);
  });

  it("keeps the top half whole, so the head is never cut", () => {
    expect(text(MASK)).toMatch(/<rect width="600" height="\d+" fill="#fff"\/>/);
  });

  it("is the brush's outline only: one subpath, so no streak cuts across the face", () => {
    const d = text(MASK).match(/<path[^>]* d="([^"]+)"/)?.[1] ?? "";
    expect(d.match(/M/g)).toHaveLength(1);
  });
});
