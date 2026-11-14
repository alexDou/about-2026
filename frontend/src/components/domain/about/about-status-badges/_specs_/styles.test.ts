// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

/** The stylesheet with its media-query preludes taken out, so breakpoints may be in px. */
const declarations = (text: string) => text.replace(/@media[^{]*\{/g, "{");

describe("about-status-badges stylesheet", () => {
  it("sizes nothing in px", () => {
    expect(declarations(css("styles.module.css"))).not.toMatch(/\d\s*px\b/);
  });

  it("is a wrapping flex row", () => {
    const row = css("styles.module.css");
    expect(row).toMatch(/display:\s*flex/);
    expect(row).toMatch(/flex-wrap:\s*wrap/);
  });
});
