// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

/** The stylesheet with its media-query preludes taken out, so breakpoints may be in px. */
const declarations = (text: string) => text.replace(/@media[^{]*\{/g, "{");

/** The declarations of one rule, by its exact selector (the first such rule). */
const rule = (text: string, selector: string) =>
  text.match(
    new RegExp(`(?:^|\\n)${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`),
  )?.[1] ?? "";

const STYLESHEETS = [
  "styles.module.css",
  "components/portrait/styles.module.css",
  "components/profile-links/styles.module.css",
];

describe("about-top-card stylesheets", () => {
  it.each(STYLESHEETS)("%s sizes nothing in px", (path) => {
    expect(declarations(css(path))).not.toMatch(/\d\s*px\b/);
  });

  it("sits on the What I do colour, in a rounded palette-colour border", () => {
    const card = rule(css("styles.module.css"), ".about-top-card");
    expect(card).toMatch(/background:\s*var\(--panel-what-i-do\)/);
    expect(card).toMatch(/border:\s*[\d.]+rem \w+ var\(--panel-[\w-]+\)/);
    expect(card).toMatch(/border-radius:\s*[\d.]+rem/);
  });

  it("pulls up under the badge row on wider screens, with a negative top margin", () => {
    const card = rule(css("styles.module.css"), ".about-top-card");
    expect(card).toMatch(/margin-top:\s*-[\d.]+rem/);
  });

  it("keeps a gap under the badge row on phones", () => {
    const sheet = css("styles.module.css");
    const phone = sheet.slice(sheet.indexOf("@media (width < 840px)"));
    expect(rule(phone, "  .about-top-card")).toMatch(/margin-top:\s*[\d.]+rem/);
  });

  it("scales its type with progress(), not clamp(), after a fixed fallback", () => {
    const sheet = css("styles.module.css");
    expect(sheet).not.toMatch(/clamp\(/);
    for (const selector of [".about-top-card__greeting", ".about-top-card__credo"]) {
      expect(rule(sheet, selector)).toMatch(
        /font-size:\s*[\d.]+rem;\s*font-size:\s*calc\([^;]*progress\(100vw,/,
      );
    }
  });

  it("centres the photo on the greeting and credo, with the actions below", () => {
    const card = rule(css("styles.module.css"), ".about-top-card");
    expect(card).toMatch(/grid-template-areas:\s*"text portrait"\s*"actions actions"/);
  });

  it("is not positioned itself, so the badge row paints over its border", () => {
    const card = rule(css("styles.module.css"), ".about-top-card");
    expect(card).not.toMatch(/position:|z-index:/);
    expect(css("styles.module.css")).not.toMatch(/position:/);
  });

  it("sets the greeting in Playfair Display", () => {
    const greeting = rule(css("styles.module.css"), ".about-top-card__greeting");
    expect(greeting).toMatch(/font-family:\s*var\(--font-greeting\)/);
  });

  it("shows the photo first on phones", () => {
    const sheet = css("styles.module.css");
    const phone = sheet.slice(sheet.indexOf("@media (width < 840px)"));
    expect(phone).toMatch(/grid-template-areas:\s*"portrait"\s*"text"\s*"actions"/);
  });

  it("colours the brush stroke the About colour at 10%", () => {
    const portrait = css("components/portrait/styles.module.css");
    expect(portrait).toMatch(/color-mix\(in srgb, var\(--panel-about\) 10%, transparent\)/);
  });

  it("frays the photo's lower edge with the brush outline and fades it out", () => {
    const photo = rule(css("components/portrait/styles.module.css"), ".portrait__photo");
    expect(photo).toMatch(/mask-image:\s*url\("\.\/media\/photo-mask\.svg"\),\s*linear-gradient\(/);
    expect(photo).toMatch(/mask-composite:\s*intersect/);
    expect(photo).toMatch(/mask-size:\s*100% 100%/);
  });
});
