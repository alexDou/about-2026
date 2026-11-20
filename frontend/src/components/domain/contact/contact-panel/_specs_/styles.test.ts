// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../styles.module.css", import.meta.url), "utf8");

/** The stylesheet with its media-query preludes taken out, so breakpoints may be in px. */
const declarations = (text: string) => text.replace(/@media[^{]*\{/g, "{");

/** The declarations of one rule, by its exact selector (the first such rule). */
const rule = (text: string, selector: string) =>
  text.match(
    new RegExp(`(?:^|\\n)\\s*${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`),
  )?.[1] ?? "";

describe("contact-panel stylesheet", () => {
  it("sizes nothing in px", () => {
    expect(declarations(css)).not.toMatch(/\d\s*px\b/);
  });

  it("is one band on the What I do colour, in the dark text colour", () => {
    const band = rule(css, ".contact-panel");
    expect(band).toMatch(/background:\s*var\(--panel-what-i-do\)/);
    expect(band).toMatch(/color:\s*var\(--text-on-light\)/);
  });

  it("is a grid with a gap, in two columns on a wide screen", () => {
    const band = rule(css, ".contact-panel");
    expect(band).toMatch(/display:\s*grid/);
    expect(band).toMatch(/gap:/);
    expect(band).toMatch(/grid-template-columns:/);
  });

  it("goes to one column below 840px, reordering the same markup", () => {
    const narrow = css.slice(css.indexOf("@media (width < 840px)"));
    expect(narrow).toMatch(/grid-template-columns:\s*1fr\b/);
    expect(narrow).toMatch(/grid-template-areas:/);
  });

  it("puts the notice right above the button on a phone", () => {
    const narrow = css.slice(css.indexOf("@media (width < 840px)"));
    const areas = narrow.match(/grid-template-areas:([^;]*);/)?.[1] ?? "";
    expect([...areas.matchAll(/"([^"]+)"/g)].map((match) => match[1])).toEqual([
      "remote",
      "links",
      "fields",
      "notice",
      "submit",
    ]);
  });
});
