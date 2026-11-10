// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = (path: string) => new URL(`../${path}`, import.meta.url);
const css = (path: string) => readFileSync(styles(path), "utf8");

/** Custom properties declared in a `:root` block, name → value. */
function rootTokens(text: string): Record<string, string> {
  const tokens: Record<string, string> = {};
  for (const [, name, value] of text.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
    if (name && value) tokens[name] = value;
  return tokens;
}

describe("tokens.css", () => {
  const raw = rootTokens(css("tokens.css"));
  /** Follows `var(--other)` aliases down to the literal value. */
  const resolve = (value: string | undefined): string | undefined => {
    const alias = value?.match(/^var\((--[\w-]+)\)$/)?.[1];
    return alias ? resolve(raw[alias]) : value;
  };
  const tokens = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, resolve(v)]));

  it.each([
    ["--panel-about", "#25363a"],
    ["--panel-what-i-do", "#d1dcd9"],
    ["--panel-skills", "#67b3a8"],
    ["--panel-chat", "#4c839f"],
    ["--panel-contact", "#5c8b70"],
    ["--text-on-dark", "#d1dcd9"],
    ["--text-on-light", "#25363a"],
  ])("defines %s as %s", (name, value) => {
    expect(tokens[name]).toBe(value);
  });
});

describe("fonts.css", () => {
  const fonts = css("fonts.css");

  it("declares Overused Grotesk as a variable, self-hosted, swapping font", () => {
    expect(fonts).toMatch(/font-family:\s*"Overused Grotesk"/);
    expect(fonts).toMatch(/font-weight:\s*200 900/);
    expect(fonts).toMatch(/font-display:\s*swap/);
    expect(fonts).toMatch(/url\("\.\/fonts\/OverusedGrotesk-VF\.woff2"\)\s*format\("woff2"\)/);
  });

  it("ships the font file with its OFL license", () => {
    expect(existsSync(styles("fonts/OverusedGrotesk-VF.woff2"))).toBe(true);
    const license = readFileSync(styles("fonts/OFL.txt"), "utf8");
    expect(license).toContain("Copyright (c) 2023-2026, Bao Nguyen (RandomMaerks)");
    expect(license).toContain("SIL OPEN FONT LICENSE Version 1.1");
  });
});

describe("global.css", () => {
  it("sets the site font on the body", () => {
    expect(rootTokens(css("tokens.css"))["--font-site"]).toMatch(/^"Overused Grotesk",/);
    expect(css("global.css")).toMatch(/font-family:\s*var\(--font-site\)/);
  });
});
