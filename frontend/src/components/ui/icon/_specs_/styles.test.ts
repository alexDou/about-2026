// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ICON_SIZES, ICON_TONES } from "../config";

const css = readFileSync(new URL("../styles.module.css", import.meta.url), "utf8");

describe("icon stylesheet", () => {
  it.each([...Object.values(ICON_SIZES), ...Object.values(ICON_TONES)])(
    "has a rule for the %s variant",
    (variant) => {
      expect(css).toContain(`.icon--${variant}`);
    },
  );

  it("draws in the colour of the text, so an icon file needs no colour of its own", () => {
    expect(css).toMatch(/fill:\s*currentColor/);
  });

  it("sizes nothing in px", () => {
    expect(css).not.toMatch(/\d\s*px\b/);
  });
});
