// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../styles.module.css", import.meta.url), "utf8");

describe("card-heading stylesheet", () => {
  it("is set in Playfair Display, through the heading font token", () => {
    expect(css).toMatch(/font-family:\s*var\(--font-heading\)/);
  });
});
