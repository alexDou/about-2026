// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../styles.module.css", import.meta.url), "utf8");

/** The declarations of one rule, by its exact selector. */
const rule = (selector: string) =>
  css.match(new RegExp(`\\n${selector.replace(".", "\\.")}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

describe("expanded-panel stylesheet", () => {
  it("puts the close corner in the panel's top-right corner, sticky", () => {
    const close = rule(".expanded-panel__close");
    expect(close).toMatch(/position:\s*sticky/);
    expect(close).toMatch(/top:\s*0/);
    expect(close).toMatch(/justify-self:\s*end/);
    expect(close).toMatch(/align-self:\s*start/);
  });

  it("gives the corner no room of its own: it shares the page's grid cell", () => {
    expect(rule(".expanded-panel__close")).toMatch(/grid-area:\s*1 \/ 1/);
    expect(rule(".expanded-panel__page")).toMatch(/grid-area:\s*1 \/ 1/);
  });
});
