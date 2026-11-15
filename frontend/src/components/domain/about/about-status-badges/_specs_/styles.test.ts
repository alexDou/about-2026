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

  const row = css("styles.module.css");
  const wide = row.slice(0, row.indexOf("@media"));
  const narrow = row.slice(row.indexOf("@media (width <= 1056px)"));

  it("puts the six badges in one line on wide screens, with no cap on their size", () => {
    expect(wide).toMatch(/display:\s*flex/);
    expect(wide).not.toMatch(/flex-wrap|max-width/);
    expect(wide).toMatch(/flex:\s*1 1 0/);
  });

  it("hangs half a badge into the top card on wide screens, from the page's width", () => {
    expect(wide).toMatch(/margin:\s*0 0 calc\(\(5 \* var\(--badge-gap\) - 100%\) \/ 12\)/);
  });

  it("wraps into rows of three above the top card up to 1056px wide", () => {
    expect(narrow).toMatch(/flex-wrap:\s*wrap/);
    expect(narrow).toMatch(/max-width:\s*calc\(3 \* var\(--badge-size\)/);
    expect(narrow).toMatch(/margin-bottom:\s*0/);
  });

  it("keeps no room for the close button: the corner sits in the page's side padding", () => {
    expect(row).not.toMatch(/close-button|close-bar/);
  });

  it("keeps the badges small on phones, growing only a little with the width, by progress()", () => {
    const phone = row.slice(row.indexOf("@media (width < 840px)"));
    expect(phone).toMatch(/--badge-size:\s*[\d.]+rem;/);
    expect(phone).toMatch(/--badge-size:\s*calc\([\d.]+rem \+ [\d.]+rem \* progress\(100vw,/);
  });
});
