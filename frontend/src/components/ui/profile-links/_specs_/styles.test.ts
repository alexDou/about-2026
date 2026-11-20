// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../styles.module.css", import.meta.url), "utf8");

/** The declarations of one rule, by its exact selector (the first such rule). */
const rule = (selector: string) =>
  css.match(
    new RegExp(`(?:^|\\n)${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`),
  )?.[1] ?? "";

describe("profile-links stylesheet", () => {
  it("sizes nothing in px", () => {
    expect(css).not.toMatch(/\d\s*px\b/);
  });

  it("lays the links out in a flex row with a gap", () => {
    const list = rule(".profile-links");
    expect(list).toMatch(/display:\s*flex/);
    expect(list).toMatch(/gap:\s*[\d.]+rem/);
  });

  it("makes the ring look round, with a ring on hover and on keyboard focus", () => {
    expect(rule(".profile-links__link--ring")).toMatch(/border-radius:\s*50%/);
    expect(css).toMatch(/\.profile-links__link--ring:hover\s*\{[^}]*(?:box-shadow|outline|border)/);
    expect(css).toMatch(
      /\.profile-links__link--ring:focus-visible\s*\{[^}]*(?:box-shadow|outline|border)/,
    );
  });

  it("takes every colour from the palette", () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(css).toMatch(/var\(--(?:panel|text)-[\w-]+\)/);
  });
});
