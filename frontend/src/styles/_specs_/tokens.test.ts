// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = (path: string) => new URL(`../${path}`, import.meta.url);
const css = (path: string) => readFileSync(styles(path), "utf8");

/** Custom properties declared in the first `:root` block (the defaults, not media overrides). */
function rootTokens(text: string): Record<string, string> {
  const tokens: Record<string, string> = {};
  const block = text.match(/:root\s*\{[^}]*\}/)?.[0] ?? "";
  for (const [, name, value] of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g))
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
    ["--font-panel", '"Overused Grotesk", system-ui, sans-serif'],
    ["--font-site", '"Amethysta", serif'],
    ["--font-heading", '"Playfair Display", Georgia, serif'],
    ["--line-height-site", "1.4"],
    ["--line-height-heading", "1.28"],
    ["--color-accent", "#e4572e"],
    ["--element-distance-standard", "1.8rem"],
  ])("defines %s as %s", (name, value) => {
    expect(tokens[name]).toBe(value);
  });
});

describe("motion tokens", () => {
  const tokens = rootTokens(css("tokens.css"));

  it.each([
    ["--enter-explore", "300ms"],
    ["--enter-stagger", "150ms"],
    ["--enter-panel", "950ms"],
    ["--enter-title", "140ms"],
    ["--label-gap-top", "1.2rem"],
    ["--label-gap-bottom", "0.6rem"],
  ])("defines %s as %s", (name, value) => {
    expect(tokens[name]).toBe(value);
  });
});

/** The shipped size (21.9 KB) plus about a quarter, so a 2x regression fails. */
const PLAYFAIR_BUDGET_BYTES = 28_000;
/** The shipped size (24.6 KB) plus about a quarter. */
const AMETHYSTA_BUDGET_BYTES = 31_000;

describe("fonts.css", () => {
  const fonts = css("fonts.css");

  it("declares Overused Grotesk as a variable, self-hosted, swapping font", () => {
    expect(fonts).toMatch(/font-family:\s*"Overused Grotesk"/);
    expect(fonts).toMatch(/font-weight:\s*200 900/);
    expect(fonts).toMatch(/font-display:\s*swap/);
    expect(fonts).toMatch(/url\("\.\/fonts\/OverusedGrotesk-VF\.woff2"\)\s*format\("woff2"\)/);
  });

  it("declares Amethysta, self-hosted and swapping, Latin only, for the site's text", () => {
    const face = fonts.slice(fonts.indexOf('font-family: "Amethysta"'));
    expect(face).toMatch(/url\("\.\/fonts\/Amethysta-Regular-latin\.woff2"\)\s*format\("woff2"\)/);
    expect(face).toMatch(/font-display:\s*swap/);
    expect(face).toMatch(/unicode-range:\s*U\+0000-00FF,/);
  });

  it("ships Amethysta as a self-hosted woff2 within its byte budget, under the same OFL", () => {
    const file = readFileSync(styles("fonts/Amethysta-Regular-latin.woff2"));
    expect(file.toString("ascii", 0, 4)).toBe("wOF2");
    expect(file.length).toBeLessThan(AMETHYSTA_BUDGET_BYTES);
    expect(readFileSync(styles("fonts/OFL.txt"), "utf8")).toContain(
      'Copyright (c) 2011, Cyreal (www.cyreal.org) with Reserved Font Name "Amethysta"',
    );
  });

  it("declares Playfair Display, self-hosted and swapping, for About's headings", () => {
    expect(fonts).toMatch(/font-family:\s*"Playfair Display"/);
    expect(fonts).toMatch(
      /url\("\.\/fonts\/PlayfairDisplay-Regular-latin\.woff2"\)\s*format\("woff2"\)/,
    );
  });

  it("ships the font file with its OFL license", () => {
    expect(existsSync(styles("fonts/OverusedGrotesk-VF.woff2"))).toBe(true);
    const license = readFileSync(styles("fonts/OFL.txt"), "utf8");
    expect(license).toContain("Copyright (c) 2023-2026, Bao Nguyen (RandomMaerks)");
    expect(license).toContain("SIL OPEN FONT LICENSE Version 1.1");
  });

  it("ships Playfair Display as a self-hosted woff2 within its byte budget, under the same OFL", () => {
    const file = readFileSync(styles("fonts/PlayfairDisplay-Regular-latin.woff2"));
    expect(file.toString("ascii", 0, 4)).toBe("wOF2");
    expect(file.length).toBeLessThan(PLAYFAIR_BUDGET_BYTES);
    expect(readFileSync(styles("fonts/OFL.txt"), "utf8")).toContain(
      "Playfair Display Project Authors",
    );
  });
});

describe("global.css", () => {
  it("sets the site font on the body", () => {
    expect(css("global.css")).toMatch(/font-family:\s*var\(--font-site\)/);
  });

  it("grows the body text with the window from 17px, after a fixed fallback", () => {
    expect(css("global.css")).toMatch(
      /font-size:\s*1\.0625rem;\s*font-size:\s*calc\(1\.0625rem \+ [\d.]+rem \* progress\(100vw,/,
    );
  });

  it("loads no font from a third party", () => {
    const html = readFileSync(new URL("../../../index.html", import.meta.url), "utf8");
    expect(html).not.toMatch(/fonts\.(googleapis|gstatic)\.com/);
  });
});
