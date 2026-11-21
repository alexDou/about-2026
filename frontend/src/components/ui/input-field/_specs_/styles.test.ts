// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { INPUT_FIELD_LAYOUTS, INPUT_FIELD_TONES } from "../config";

const css = readFileSync(new URL("../styles.module.css", import.meta.url), "utf8");

/** The declarations of one rule, by its exact selector (the first such rule). */
const rule = (selector: string) =>
  css.match(
    new RegExp(`(?:^|\\n)${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`),
  )?.[1] ?? "";

describe("input-field stylesheet", () => {
  it.each([...Object.values(INPUT_FIELD_LAYOUTS), ...Object.values(INPUT_FIELD_TONES)])(
    "has a rule for the %s variant",
    (variant) => {
      expect(css).toContain(`.input-field--${variant}`);
    },
  );

  it("is a grid with a gap, the label and the input on one row when inline", () => {
    expect(rule(".input-field")).toMatch(/display:\s*grid/);
    expect(rule(".input-field")).toMatch(/gap:/);
    expect(rule(".input-field--inline")).toMatch(/grid-template-columns:\s*[^;]+\s+minmax/);
  });

  it("puts an inline label above its input on a screen under 568px", () => {
    const narrow = css.slice(css.indexOf("@media (width < 35.5rem)"));
    expect(narrow).toMatch(
      /\.input-field--inline\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/,
    );
  });

  it("takes every colour from the palette", () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
  });

  it("sizes nothing in px", () => {
    expect(css.replace(/@media[^{]*\{/g, "{")).not.toMatch(/\d\s*px\b/);
  });
});
