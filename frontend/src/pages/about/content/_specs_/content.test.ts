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
      ["AVAILABLE NOW", "Can start immediately."],
      ["FULL-TIME", "Open to a permanent, full-time position."],
      ["CONTRACT", "Open to contract work."],
      ["RELOCATION", "Open to relocation anywhere, for the right offer."],
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

  it("gives every Role its highlights in order, and the Tipico Role an intro", () => {
    ABOUT_CONTENT.roles.forEach((role, index) => {
      const n = index + 1;
      expect(role.highlights.length).toBeGreaterThan(0);
      expect(role.highlights).toEqual(
        role.highlights.map((_, position) => `about.role.${n}.highlight.${position + 1}`),
      );
    });
    expect(ABOUT_CONTENT.roles[1]?.intro).toBe("about.role.2.intro");
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
    expect(en(ABOUT_CONTENT.bio.professional)).toBe(
      "Full-stack by trade, equally solid on the frontend and the backend. My work rests on the fundamentals of the craft: system design, clean code and architecture, test-driven development, refactoring and domain-driven design. A proven ability to turn complex business requirements into scalable, maintainable software. AI ready: I build AI-powered features into products and work in agentic, AI-assisted development, keeping both the agents and the code they generate under thorough control.",
    );
    expect(en(ABOUT_CONTENT.bio.personal)).toBe(
      "Born in Moscow, based in Germany since 2019, a permanent EU resident. I prefer remote work and am open to hybrid.",
    );
  });

  it("names the freelance years Self-employed, with PHP (PHP 7 came after them)", () => {
    const freelance = ABOUT_CONTENT.roles[4];
    expect(freelance && en(freelance.company)).toBe("Self-employed");
    expect(freelance && en(freelance.technologies)).not.toContain("PHP 7");
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
