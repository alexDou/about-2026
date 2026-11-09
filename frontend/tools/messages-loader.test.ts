// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createIntl } from "@formatjs/intl";
import { describe, expect, it } from "vitest";
import { compileMessages } from "./messages-loader.ts";

const EN_DIR = join(import.meta.dirname, "../src/i18n/en");

/** Every English message file as it sits on disk: id → ICU string. */
const EN_FILES = readdirSync(EN_DIR)
  .filter((name) => name.endsWith(".json"))
  .map((name) => ({ name, source: readFileSync(join(EN_DIR, name), "utf8") }));

/** Formats `id` from `messages` (ICU strings or compiled ASTs) the way the site does. */
function format(messages: Record<string, unknown>, id: string, values?: Record<string, number>) {
  const intl = createIntl({ locale: "en", defaultLocale: "en", messages: messages as never });
  return intl.formatMessage({ id: id as never }, values);
}

describe("compileMessages", () => {
  it("turns every message into an AST, so the bundle needs no parser", () => {
    const compiled = JSON.parse(compileMessages('{"x.hello": "Hello {name}"}')) as Record<
      string,
      unknown
    >;
    expect(Object.keys(compiled)).toEqual(["x.hello"]);
    expect(compiled["x.hello"]).toBeInstanceOf(Array);
  });

  it.each(EN_FILES)("formats every message in $name exactly like its source", ({ source }) => {
    const strings = JSON.parse(source) as Record<string, string>;
    const compiled = JSON.parse(compileMessages(source)) as Record<string, unknown>;
    for (const id of Object.keys(strings)) {
      expect(format(compiled, id)).toBe(format(strings, id));
    }
  });

  it("keeps arguments and plurals working", () => {
    const source = '{"x.items": "{count, plural, one {# item} other {# items}}"}';
    const compiled = JSON.parse(compileMessages(source)) as Record<string, unknown>;
    expect(format(compiled, "x.items", { count: 1 })).toBe("1 item");
    expect(format(compiled, "x.items", { count: 3 })).toBe("3 items");
  });

  it("fails the build on a malformed message, naming its id", () => {
    expect(() => compileMessages('{"x.fine": "Hi", "x.broken": "Hello {name"}')).toThrow(
      /x\.broken/,
    );
  });
});
