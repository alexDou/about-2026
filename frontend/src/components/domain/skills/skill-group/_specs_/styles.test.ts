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

describe("SkillGroup stylesheet", () => {
  it("is the Contact green closed and a darker green open, with dark then light text", () => {
    expect(rule(".skill-group")).toMatch(/background:\s*var\(--panel-contact\)/);
    expect(rule(".skill-group")).toMatch(/color:\s*var\(--text-on-light\)/);
    expect(rule(".skill-group--open")).toMatch(/background:\s*var\(--skills-band-open\)/);
    expect(rule(".skill-group--open")).toMatch(/color:\s*var\(--text-on-dark\)/);
  });

  it("puts the name on the left and the icon on the right of the band", () => {
    expect(rule(".skill-group__toggle")).toMatch(/display:\s*grid/);
    expect(rule(".skill-group__toggle")).toMatch(/grid-template-columns:\s*1fr auto/);
    expect(rule(".skill-group__toggle")).toMatch(/text-align:\s*start/);
  });

  it("turns the icon when the band opens", () => {
    expect(rule(".skill-group--open .skill-group__icon::before")).toMatch(/rotate:/);
  });

  it("opens the panel in CSS, a grid row and a fade, and keeps it out of reach while closed", () => {
    expect(rule(".skill-group__panel")).toMatch(/grid-template-rows:\s*0fr/);
    expect(rule(".skill-group__panel")).toMatch(/visibility:\s*hidden/);
    expect(rule(".skill-group__panel--open")).toMatch(/grid-template-rows:\s*1fr/);
    expect(rule(".skill-group__panel--open")).toMatch(/visibility:\s*visible/);
  });

  it("plays none of it under reduced motion", () => {
    const media = /@media \(prefers-reduced-motion: reduce\)\s*{([\s\S]*)}\s*$/.exec(css)?.[1];
    expect(media).toMatch(/\.skill-group__panel--open/);
    expect(media).toMatch(/transition:\s*none/);
  });
});
