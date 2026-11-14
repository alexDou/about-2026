// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../styles.module.css", import.meta.url), "utf8");
const phone = css.slice(css.indexOf("@media (width < 840px)"));

describe("about-languages-hobbies-card stylesheet", () => {
  it("lays the columns side by side, two grid columns", () => {
    const wide = css.slice(0, css.indexOf("@media"));
    expect(wide).toMatch(/grid-template-columns:\s*minmax\(0, 1fr\) minmax\(0, 2fr\)/);
  });

  it("stacks them on phones, in one column", () => {
    expect(phone).toMatch(/grid-template-columns:\s*minmax\(0, 1fr\);/);
  });

  it("sizes nothing in px", () => {
    expect(css.replace(/@media[^{]*\{/g, "{")).not.toMatch(/\d\s*px\b/);
  });
});
