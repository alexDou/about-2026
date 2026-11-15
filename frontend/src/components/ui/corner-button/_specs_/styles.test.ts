// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../styles.module.css", import.meta.url), "utf8");

describe("corner-button stylesheet", () => {
  it("is a 1.5rem (24px) square, the WCAG 2.5.8 minimum target", () => {
    expect(css).toMatch(/--corner-button-size:\s*1\.5rem/);
    expect(css).toMatch(/width:\s*var\(--corner-button-size\)/);
    expect(css).toMatch(/height:\s*var\(--corner-button-size\)/);
  });

  it("paints the upper-right flap in the accent red with CSS alone, the lower-left transparent", () => {
    expect(css).toMatch(/--corner-button-color:\s*var\(--color-accent\)/);
    expect(css).toMatch(
      /radial-gradient\(\s*circle var\(--corner-button-size\) at 0 100%,\s*transparent 0/,
    );
    expect(css).not.toMatch(/url\(/);
  });

  it("creases the flap's edge in the surrounding text colour, for 3:1 on every panel", () => {
    expect(css).toMatch(/color:\s*inherit/);
    expect(css).toMatch(/currentColor 100% calc\(100% \+ var\(--corner-button-crease\)\)/);
  });

  it("shows keyboard focus inside the square, in the text colour", () => {
    expect(css).toMatch(/:focus-visible\s*\{[^}]*outline:\s*0\.125rem solid currentColor/);
    expect(css).toMatch(/:focus-visible\s*\{[^}]*outline-offset:\s*-/);
  });
});
