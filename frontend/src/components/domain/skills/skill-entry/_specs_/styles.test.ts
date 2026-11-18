import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "../styles.module.css"), "utf8");

/** The declarations of the first rule for `selector`. */
const rule = (selector: string) => {
  const escaped = selector.replaceAll(".", "\\.");
  const match = new RegExp(`${escaped}\\s*{([^}]*)}`).exec(css);
  expect(match, `a rule for ${selector}`).not.toBeNull();
  return match![1]!;
};

describe("SkillEntry stylesheet", () => {
  it("pads the arrow to a target of 24px or more (WCAG 2.2), 1.5rem at the default size", () => {
    const arrow = rule(".skill-entry__arrow");
    for (const property of ["min-width", "min-height"]) {
      const rem = Number(new RegExp(`${property}:\\s*([\\d.]+)rem`).exec(arrow)?.[1]);
      expect(rem).toBeGreaterThanOrEqual(1.5);
    }
  });

  it("opens and closes the overview in CSS: a grid row and a fade, no JS", () => {
    expect(rule(".skill-entry__overview")).toMatch(/display:\s*grid/);
    expect(rule(".skill-entry__overview")).toMatch(/transition:[^;]*grid-template-rows/);
    expect(rule(".skill-entry__overview")).toMatch(/transition:[^;]*opacity/);
    expect(rule(".skill-entry__overview--open")).toMatch(/grid-template-rows:\s*1fr/);
  });

  it("keeps a closed overview out of find-in-page and the keyboard", () => {
    expect(rule(".skill-entry__overview")).toMatch(/visibility:\s*hidden/);
    expect(rule(".skill-entry__overview--open")).toMatch(/visibility:\s*visible/);
  });

  it("turns the arrow when the overview is open", () => {
    expect(rule(".skill-entry__arrow--open .skill-entry__arrow-shape")).toMatch(/rotate:/);
  });

  it("plays none of it under reduced motion", () => {
    const media = /@media \(prefers-reduced-motion: reduce\)\s*{([\s\S]*)}\s*$/.exec(css)?.[1];
    expect(media).toMatch(/\.skill-entry__overview--open/);
    expect(media).toMatch(/\.skill-entry__arrow-shape/);
    expect(media).toMatch(/transition:\s*none/);
  });
});
