import { createIntl } from "@formatjs/intl";
import { describe, expect, it } from "vitest";
import { enMessages, type MessageId } from "../../../../i18n";
import { ABOUT_CONTENT } from "..";

const intl = createIntl({
  locale: "en",
  defaultLocale: "en",
  messages: enMessages,
  onError: (error) => {
    throw error;
  },
});

/** The English text of one message; throws when it is missing or does not format. */
const en = (id: MessageId) => intl.formatMessage({ id });

/** Every message id the content refers to, found at any depth. `kind` fields are names, not ids. */
function referencedIds(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(referencedIds);
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, inner]) =>
      key === "kind" ? [] : referencedIds(inner),
    );
  }
  return [];
}

const ABOUT_IDS = Object.keys(enMessages).filter((id) => id.startsWith("about."));

describe("About content", () => {
  it("refers only to messages that exist and format, and every about.* message is used", () => {
    const referenced = referencedIds(ABOUT_CONTENT);
    for (const id of referenced) expect(enMessages).toHaveProperty([id]);
    expect(referenced.map((id) => en(id as MessageId))).not.toContain("");
    expect([...new Set(referenced)].toSorted()).toEqual(ABOUT_IDS.toSorted());
  });

  it("has six badges in order: Available Now, Full-time, Contract, Relocation, Remote work, AI ready", () => {
    expect(ABOUT_CONTENT.badges.map((badge) => badge.kind)).toEqual([
      "availableNow",
      "fullTime",
      "contract",
      "relocation",
      "remoteWork",
      "aiReady",
    ]);
  });

  it("gives each badge its text and title, final", () => {
    expect(ABOUT_CONTENT.badges.map((badge) => [en(badge.text), en(badge.title)])).toEqual([
      ["AVAILABLE NOW", "Available now, can start right away."],
      ["FULL-TIME", "Open to a permanent, full-time position."],
      ["CONTRACT", "Open to contract work."],
      ["RELOCATION", "Ready to relocate on good conditions, anywhere."],
      ["REMOTE WORK / READY", "Remote first, with years in distributed international teams."],
      [
        "AI READY",
        "I build AI features into products and work with agentic, AI-assisted development.",
      ],
    ]);
  });

  it("has five Roles, newest first (Role 1 is the newest)", () => {
    expect(ABOUT_CONTENT.roles.map((role) => role.title)).toEqual([
      "about.role.1.title",
      "about.role.2.title",
      "about.role.3.title",
      "about.role.4.title",
      "about.role.5.title",
    ]);
  });

  it("lists the four languages with their levels", () => {
    expect(
      ABOUT_CONTENT.languages.map((language) => [
        en(language.name),
        en(language.level),
        language.cefr && en(language.cefr),
      ]),
    ).toEqual([
      ["Russian", "Native", undefined],
      ["English", "Fluent", "C1"],
      ["German", "Good working knowledge", "B2"],
      ["Spanish", "Basic", "A2"],
    ]);
  });

  it("names the Owner and gives the approved Bio", () => {
    expect(en(ABOUT_CONTENT.name)).toBe("Alexander Durnev");
    expect(en(ABOUT_CONTENT.bio)).toBe(
      "Born in Moscow in January 1972, living in Germany since 2019. A permanent EU resident. I prefer remote work and am open to hybrid.",
    );
  });

  it("lists the five Hobbies in order", () => {
    expect(ABOUT_CONTENT.hobbies.map((hobby) => en(hobby.name))).toEqual([
      "Technologies",
      "Science",
      "History and travel",
      "Sport",
      "Art",
    ]);
  });

  it("has the Hobbies, the Headline, the credo and the CV label", () => {
    expect(ABOUT_CONTENT.hobbies.length).toBeGreaterThan(0);
    expect(en(ABOUT_CONTENT.headline)).not.toBe("");
    expect(en(ABOUT_CONTENT.credo)).not.toBe("");
    expect(en(ABOUT_CONTENT.cvLabel)).not.toBe("");
  });
});
