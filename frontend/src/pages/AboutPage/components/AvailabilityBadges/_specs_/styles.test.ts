// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

/** The stylesheet with its media-query preludes taken out, so breakpoints may be in px. */
const declarations = (text: string) => text.replace(/@media[^{]*\{/g, "{");

const STYLESHEETS = [
  "styles.module.css",
  "components/BadgeFrame/styles.module.css",
  "components/AvailableNowBadge/styles.module.css",
  "components/FullTimeBadge/styles.module.css",
  "components/ContractBadge/styles.module.css",
  "components/RelocationBadge/styles.module.css",
  "components/RemoteWorkBadge/styles.module.css",
  "components/AiReadyBadge/styles.module.css",
] as const;

describe("badge stylesheets", () => {
  it.each(STYLESHEETS)("%s sizes nothing in px", (path) => {
    expect(declarations(css(path))).not.toMatch(/\d\s*px\b/);
  });

  it("the row is a wrapping flex row", () => {
    const row = css("styles.module.css");
    expect(row).toMatch(/display:\s*flex/);
    expect(row).toMatch(/flex-wrap:\s*wrap/);
  });
});
