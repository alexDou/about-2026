// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const css = read("styles.module.css");
const component = read("Explore.tsrx");

/** The declarations of one rule, by its exact selector (indented: inside a media query). */
const rule = (selector: string) =>
  css.match(new RegExp(`\\n\\s*${selector.replace(".", "\\.")}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

describe("explore stylesheet", () => {
  it("has no class that Explore does not render", () => {
    const classes = new Set([...css.matchAll(/\.([a-z][\w-]*)\s*[{,:]/g)].map(([, name]) => name));
    for (const name of classes) expect(component).toContain(`styles["${name}"]`);
  });

  it("slides Explore in, clipping the page's overflow while the Panels unfold", () => {
    expect(rule(".explore")).toMatch(/slide-in var\(--enter-explore\)/);
    expect(rule(".explore")).toMatch(/clip-overflow var\(--enter-total\)/);
  });
});
