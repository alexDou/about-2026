import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createIntl } from "@formatjs/intl";
import { type MessageFormatElement, parse } from "@formatjs/icu-messageformat-parser";
import { describe, expect, expectTypeOf, it } from "vitest";
import { PANEL_IDS } from "../../hooks/useRoute";
import { enMessages, type MessageId } from "..";

// A path, not a URL: jsdom replaces the global `URL`, which `node:fs` then rejects.
const EN_DIR = join(import.meta.dirname, "../en");

/** Every English message file on disk, keyed by its area (the file name). */
const EN_FILES: ReadonlyArray<{ area: string; messages: Record<string, unknown> }> = readdirSync(
  EN_DIR,
)
  .filter((name) => name.endsWith(".json"))
  .map((name) => ({
    area: name.replace(/\.json$/, ""),
    messages: JSON.parse(readFileSync(join(EN_DIR, name), "utf8")) as Record<string, unknown>,
  }));

/** Formats one message as the site does; a formatting error throws instead of falling back. */
function format(messages: Record<string, unknown>, id: string): string {
  const intl = createIntl({
    locale: "en",
    defaultLocale: "en",
    messages: messages as Record<string, MessageFormatElement[]>,
    onError: (error) => {
      throw error;
    },
  });
  return intl.formatMessage({ id: id as MessageId });
}

/** The ids whose message is not a FormatJS AST that formats cleanly, in file order. */
function unformattable(messages: Record<string, unknown>): string[] {
  return Object.entries(messages)
    .filter(([id, message]) => {
      if (!Array.isArray(message)) return true;
      try {
        format(messages, id);
        return false;
      } catch {
        return true;
      }
    })
    .map(([id]) => id);
}

const en = (id: string) => format(enMessages, id);

describe("English message files", () => {
  it("include the site, the Landing and the Board", () => {
    expect(EN_FILES.map((file) => file.area)).toEqual(
      expect.arrayContaining(["board", "landing", "site"]),
    );
  });

  it.each(EN_FILES)("prefix every id in the $area file with its area", ({ area, messages }) => {
    for (const id of Object.keys(messages)) expect(id).toMatch(new RegExp(`^${area}\\.`));
  });

  it.each(EN_FILES)("include every message of the $area file", ({ messages }) => {
    expect(enMessages).toMatchObject(messages);
  });
});

describe("English messages", () => {
  it("name the site", () => {
    expect(en("site.title")).toBe("A.Durnev portfolio");
  });

  it("title every Panel and label its close button", () => {
    expect(PANEL_IDS.map((panel) => en(`board.panel.${panel}.title`))).toEqual([
      "About",
      "What I do",
      "Skills",
      "Chat with me",
      "Contact",
    ]);
    expect(PANEL_IDS.map((panel) => en(`board.panel.${panel}.close`))).toEqual([
      "Close About",
      "Close What I do",
      "Close Skills",
      "Close Chat with me",
      "Close Contact",
    ]);
  });

  it("give Sublabels to What I do and Chat with me only", () => {
    const sublabels = Object.fromEntries(
      PANEL_IDS.map((panel) => {
        const id = `board.panel.${panel}.sublabel`;
        return [panel, id in enMessages ? en(id) : undefined];
      }),
    );
    expect(sublabels).toEqual({
      about: undefined,
      whatIDo: "36 Takeovers",
      skills: undefined,
      chatWithMe: "AI agent trained on my data",
      contact: undefined,
    });
  });

  it("label the logo and the status badge on the Landing", () => {
    expect(
      [
        "landing.logo.label",
        "landing.status.checking",
        "landing.status.ok",
        "landing.status.down",
      ].map(en),
    ).toEqual(["Portfolio A.Durnev", "API: checking", "API: ok", "API: down"]);
  });
});

describe("MessageId", () => {
  it("accepts the ids of the English messages and rejects any other", () => {
    // Checked by the typecheck (tsrs), not at run time.
    expectTypeOf<
      "site.title" | "landing.logo.label" | "board.panel.skills.title"
    >().toExtend<MessageId>();
    expectTypeOf<"board.panel.skills.subtitle">().not.toExtend<MessageId>();
  });
});

describe("AST check", () => {
  it("flags a message that is not a formattable AST, by id", () => {
    expect(
      unformattable({
        "x.fine": parse("Hello"),
        "x.string": "Hello",
        "x.broken": [{ type: 99 }],
      }),
    ).toEqual(["x.string", "x.broken"]);
  });

  it.each(EN_FILES)("passes every message in the $area file", ({ messages }) => {
    expect(unformattable(messages)).toEqual([]);
  });
});
