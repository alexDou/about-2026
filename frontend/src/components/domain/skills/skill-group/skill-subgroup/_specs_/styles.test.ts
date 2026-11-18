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

describe("SkillSubgroup stylesheet", () => {
  it("is a name the full width of the group, with room on the left and little above and below", () => {
    expect(rule(".skill-subgroup__toggle")).toMatch(/width:\s*100%/);
    expect(rule(".skill-subgroup__toggle")).toMatch(
      /padding-inline:\s*var\(--skills-subgroup-indent\)/,
    );
    expect(rule(".skill-subgroup__toggle")).toMatch(/padding-block:/);
  });

  it("changes only the name's background: a step darker, and another when expanded", () => {
    expect(rule(".skill-subgroup__toggle")).toMatch(/background:\s*var\(--skills-heading\)/);
    expect(rule(".skill-subgroup--open .skill-subgroup__toggle")).toMatch(
      /background:\s*var\(--skills-heading-open\)/,
    );
    expect(css).not.toMatch(/\.skill-subgroup(--open)?\s*{[^}]*background/);
    expect(rule(".skill-subgroup__heading")).toMatch(/font-weight:\s*400/);
  });

  it("has square corners", () => {
    expect(css).not.toMatch(/border-radius/);
  });
});
