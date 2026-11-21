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

  it("has no band of its own: the items stand on the Panel's colour", () => {
    const panel = rule(css, ".contact-panel");
    expect(panel).not.toMatch(/background/);
    expect(panel).not.toMatch(/padding/);
  });

  it("is a grid with a gap, centred, the form on the left and the info block on the right", () => {
    const panel = rule(css, ".contact-panel");
    expect(panel).toMatch(/display:\s*grid/);
    expect(panel).toMatch(/gap:/);
    expect(panel).toMatch(/justify-content:\s*center/);
    const areas = panel.match(/grid-template-areas:([^;]*);/)?.[1] ?? "";
    expect([...areas.matchAll(/"([^"]+)"/g)].map((match) => match[1])).toEqual([
      ". info",
      "fields info",
      "submit info",
    ]);
  });

  it("centres the info block against the form's fields, which have a row of their own", () => {
    expect(rule(css, ".contact-panel__info")).toMatch(/align-self:\s*center/);
    expect(rule(css, ".contact-panel")).toMatch(/grid-template-rows:\s*1fr auto 1fr/);
  });

  it("limits the width of its columns", () => {
    expect(rule(css, ".contact-panel")).toMatch(
      /grid-template-columns:[^;]*minmax\(0, [\d.]+rem\)/,
    );
  });

  it("goes to one column below 840px, reordering the same markup", () => {
    const narrow = css.slice(css.indexOf("@media (width < 840px)"));
    expect(narrow).toMatch(/grid-template-columns:\s*minmax\(0, [\d.]+rem\);/);
    expect(narrow).toMatch(/grid-template-areas:/);
    expect(narrow).toMatch(/\.contact-panel__info\s*\{[^}]*display:\s*contents/);
  });

  it("runs on a phone: remote line, form, button, notice, required line, links", () => {
    const narrow = css.slice(css.indexOf("@media (width < 840px)"));
    const areas = narrow.match(/grid-template-areas:([^;]*);/)?.[1] ?? "";
    expect([...areas.matchAll(/"([^"]+)"/g)].map((match) => match[1])).toEqual([
      "remote",
      "fields",
      "submit",
      "notice",
      "required",
      "links",
    ]);
  });
});
