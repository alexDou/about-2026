import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(import.meta.dirname, "../styles.module.css"), "utf8");

/** The declarations of the first rule for `selector`. */
const rule = (selector: string) => {
  const escaped = selector.replaceAll(".", "\\.");
  const match = new RegExp(`${escaped}\\s*{([^}]*)}`).exec(css);
  expect(match, `a rule for ${selector}`).not.toBeNull();
  return match![1]!;
};

describe("CertificateView stylesheet", () => {
  it("comes in and goes out in CSS: a start style, and discrete transitions for display and overlay", () => {
    expect(css).toMatch(/@starting-style/);
    const dialog = rule(".certificate-view__dialog");
    expect(dialog).toMatch(/transition:[^;]*display[^;]*allow-discrete/);
    expect(dialog).toMatch(/transition:[^;]*overlay[^;]*allow-discrete/);
  });

  it("is quick: no longer than the overview's own duration", () => {
    expect(rule(".certificate-view__dialog")).toMatch(/var\(--overview-duration\)/);
  });

  it("plays none of it under reduced motion", () => {
    const media = /@media \(prefers-reduced-motion: reduce\)\s*{([\s\S]*)}\s*$/.exec(css)?.[1];
    expect(media).toMatch(/\.certificate-view__dialog/);
    expect(media).toMatch(/transition:\s*none/);
  });

  it("fits the image to the dialog, whatever its shape", () => {
    expect(rule(".certificate-view__image")).toMatch(/max-width:\s*100%/);
    expect(rule(".certificate-view__image")).toMatch(/height:\s*auto/);
  });

  it("has square corners", () => {
    expect(css).not.toMatch(/border-radius/);
  });
});
