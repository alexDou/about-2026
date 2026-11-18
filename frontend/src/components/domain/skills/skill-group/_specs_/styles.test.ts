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
  it("keeps its content on the What I do colour with the About text colour, open or closed", () => {
    expect(rule(".skill-group")).toMatch(/background:\s*var\(--panel-what-i-do\)/);
    expect(rule(".skill-group")).toMatch(/color:\s*var\(--text-on-light\)/);
    expect(css).not.toMatch(/\.skill-group--open\s*{/);
  });

  it("changes only the name's background: a step darker, and another when open", () => {
    expect(rule(".skill-group__toggle")).toMatch(/background:\s*var\(--skills-heading\)/);
    expect(rule(".skill-group--open .skill-group__toggle")).toMatch(
      /background:\s*var\(--skills-heading-open\)/,
    );
    expect(rule(".skill-group__heading")).toMatch(/font-weight:\s*400/);
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

  it("has square corners", () => {
    expect(css).not.toMatch(/border-radius/);
  });

  it("plays none of it under reduced motion", () => {
    const media = /@media \(prefers-reduced-motion: reduce\)\s*{([\s\S]*)}\s*$/.exec(css)?.[1];
    expect(media).toMatch(/\.skill-group__panel--open/);
    expect(media).toMatch(/transition:\s*none/);
  });
});
