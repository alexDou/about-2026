// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../styles.module.css", import.meta.url), "utf8");

describe("card stylesheet", () => {
  it("sits on the What I do colour with the dark text colour", () => {
    expect(css).toMatch(/background:\s*var\(--panel-what-i-do\)/);
    expect(css).toMatch(/color:\s*var\(--text-on-light\)/);
  });

  it("sizes nothing in px", () => {
    expect(css.replace(/@media[^{]*\{/g, "{")).not.toMatch(/\d\s*px\b/);
  });
});
