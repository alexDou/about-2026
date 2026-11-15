// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../styles.module.css", import.meta.url), "utf8");

/** The declarations of one rule, by its exact selector. */
const rule = (selector: string) =>
  css.match(new RegExp(`(?:^|\\n)${selector.replace(".", "\\.")}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

describe("about-page stylesheet", () => {
  it("leaves the same room under the top card as under the last card, so the top card stands out", () => {
    const gap = rule(".about-page").match(/--about-page-edge-gap:\s*([\d.]+)rem/)?.[1];
    expect(Number(gap)).toBeGreaterThan(1.5);
    expect(rule(".about-page")).toMatch(
      /padding:\s*1rem var\(--element-distance-standard\) var\(--about-page-edge-gap\)/,
    );
    expect(rule(".about-page__cards")).toMatch(/margin-top:\s*var\(--about-page-edge-gap\)/);
  });

  it("keeps the lower cards closer to each other than to the top card", () => {
    expect(rule(".about-page__cards")).toMatch(/gap:\s*var\(--element-distance-standard\)/);
  });

  it("keeps a side padding wider than the 1.4rem close corner, 2rem on phones", () => {
    const phone = css.slice(css.indexOf("@media (width < 840px)"));
    expect(phone).toMatch(/padding-right:\s*2rem/);
  });

  it("is a grid, so the badge row's hang and the top card's margin add up instead of collapsing", () => {
    expect(rule(".about-page")).toMatch(/display:\s*grid/);
  });
});
