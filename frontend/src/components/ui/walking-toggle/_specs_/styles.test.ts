// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../styles.module.css", import.meta.url), "utf8");
const tokens = readFileSync(new URL("../../../../styles/tokens.css", import.meta.url), "utf8");

/** The body of the first rule whose selector ends with `selector`. */
function rule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
}

/** The whole block of an at-rule, nested braces included. */
function atRule(prelude: string): string {
  const start = css.indexOf(prelude);
  if (start < 0) return "";
  let depth = 0;
  for (let i = css.indexOf("{", start); i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) return css.slice(start, i + 1);
  }
  return "";
}

describe("walking-toggle stylesheet", () => {
  it("makes the track the row's height, the token Copy skills shares", () => {
    expect(tokens).toMatch(/--control-height:/);
    expect(rule(".walking-toggle")).toMatch(/var\(--control-height\)/);
  });

  it("colours the track grey-teal when off and deep teal when on, head and legs in ink", () => {
    expect(rule(".walking-toggle__track")).toMatch(/background-color:\s*#98b2ae/i);
    expect(rule('.walking-toggle__track[aria-checked="true"]')).toMatch(
      /background-color:\s*#04b198/i,
    );
    expect(rule(".walking-toggle__handle")).toMatch(/color:\s*var\(--panel-about\)/);
    expect(rule(".walking-toggle__head")).toMatch(/fill:\s*currentColor/);
  });

  it("walks for 1s, as approved by the Owner", () => {
    expect(rule(".walking-toggle")).toMatch(/--walking-toggle-walk:\s*1s/);
    expect(css).toMatch(/animation-duration:\s*var\(--walking-toggle-walk\)/);
  });

  it("walks both ways, only with the walking modifier", () => {
    const walkOn = rule(
      '.walking-toggle__track[aria-checked="true"] ~ .walking-toggle__handle--walking',
    );
    const walkOff = rule(".walking-toggle__handle--walking");
    expect(walkOn).toMatch(/animation-name:/);
    expect(walkOff).toMatch(/animation-name:/);
    expect(walkOn).not.toBe(walkOff);
  });

  it("keeps the reference's face and dirt out", () => {
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(rules).not.toMatch(/face|dirt/);
  });

  it("walks only for those who accept motion; under reduced motion the handle only slides", () => {
    const motion = atRule("@media (prefers-reduced-motion: no-preference)");
    expect(motion).toMatch(/animation-name:/);
    expect(css.replace(motion, "")).not.toMatch(/animation-name:/);
    expect(atRule("@media (prefers-reduced-motion: reduce)")).toMatch(/transition:\s*transform/);
  });

  it("puts the hint in a column right after the track, taking no room of its own", () => {
    expect(rule(".walking-toggle")).toMatch(/grid-template:\s*[^;]*\/\s*3em\s+0\s*;/);
    expect(rule(".walking-toggle__hint")).toMatch(/grid-area:\s*1\s*\/\s*2/);
    expect(rule(".walking-toggle__hint")).toMatch(/white-space:\s*nowrap/);
    // Its own width, not the column's: unstretched, so its background covers its text.
    expect(rule(".walking-toggle__hint")).toMatch(/justify-self:\s*start/);
  });

  it("styles the hint in the palette", () => {
    const hint = rule(".walking-toggle__hint");
    expect(hint).toMatch(/background-color:\s*var\(--panel-about\)/);
    expect(hint).toMatch(/color:\s*var\(--text-on-dark\)/);
  });

  it("hides the hint until the track is hovered or focused, fading it in and out, all in CSS", () => {
    const hidden = rule(".walking-toggle__hint");
    expect(hidden).toMatch(/opacity:\s*0/);
    expect(hidden).toMatch(/visibility:\s*hidden/);
    expect(hidden).toMatch(/transition:/);
    const hover = atRule("@media (hover: hover)");
    expect(hover).toMatch(/\.walking-toggle__track:hover\s*~\s*\.walking-toggle__hint/);
    expect(css).toMatch(/\.walking-toggle__track:focus-visible\s*~\s*\.walking-toggle__hint/);
    expect(css).not.toMatch(/popover|interest|position-area|anchor/);
  });

  it("shows keyboard focus on the track", () => {
    expect(rule(".walking-toggle__track:focus-visible")).toMatch(/outline:/);
  });
});
