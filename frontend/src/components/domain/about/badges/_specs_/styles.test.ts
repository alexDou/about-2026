// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

/** The stylesheet with its media-query preludes taken out, so breakpoints may be in px. */
const declarations = (text: string) => text.replace(/@media[^{]*\{/g, "{");

const STYLESHEETS = [
  "available-now-badge",
  "full-time-badge",
  "contract-badge",
  "relocation-badge",
  "remote-work-badge",
  "ai-ready-badge",
].map((folder) => `${folder}/styles.module.css`);

describe("badge stylesheets", () => {
  it.each(STYLESHEETS)("%s sizes nothing in px", (path) => {
    expect(declarations(css(path))).not.toMatch(/\d\s*px\b/);
  });
});
