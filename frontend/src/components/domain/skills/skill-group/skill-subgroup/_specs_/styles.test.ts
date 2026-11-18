import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "../styles.module.css"), "utf8");

describe("SkillSubgroup stylesheet", () => {
  it("is a padded box on a darker green than the band, darker again while expanded", () => {
    expect(css).toMatch(/\.skill-subgroup\s*{[^}]*padding:/);
    expect(css).toMatch(/\.skill-subgroup\s*{[^}]*background:\s*var\(--skills-subgroup\)/);
    expect(css).toMatch(
      /\.skill-subgroup--open\s*{[^}]*background:\s*var\(--skills-subgroup-open\)/,
    );
  });
});
