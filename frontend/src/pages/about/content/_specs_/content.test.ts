import { existsSync } from "node:fs";
import { resolve } from "node:path";
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

/** A file under `frontend/`, found from this test file, so the run's working directory is free. */
const frontendFile = (path: string) => resolve(import.meta.dirname, "../../../../..", path);

/** The English text of one message; throws when it is missing or does not format. */
const en = (id: MessageId) => intl.formatMessage({ id });

/** Fields that hold no message id: `kind` is a name, `url` an address. */
const NOT_IDS = new Set(["kind", "url"]);

/** Every message id the content refers to, found at any depth. */
function referencedIds(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(referencedIds);
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, inner]) =>
      NOT_IDS.has(key) ? [] : referencedIds(inner),
    );
  }
  return [];
}

const ABOUT_IDS = Object.keys(enMessages).filter((id) => id.startsWith("about."));

describe("About content", () => {
  it("refers only to messages that exist and format, and every about.* message is used", () => {
    const referenced = referencedIds(ABOUT_CONTENT);
    for (const id of referenced) expect(enMessages).toHaveProperty([id]);
    // The arguments of the greeting and of the language lines; the other messages ignore them.
    const values = {
      name: "Name",
      level: "level",
      cefr: "A1",
      company: "C",
      period: "P",
      place: "L",
      school: "S",
      year: "Y",
    };
    expect(
      referenced.map((id) => intl.formatMessage({ id: id as MessageId }, values)),
    ).not.toContain("");
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
      ["Russian", "native", undefined],
      ["English", "fluent", "C1"],
      ["German", "good working knowledge", "B2"],
      ["Spanish", "basic", "A2"],
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

  it("greets with the name, then the Headline as its own sentence", () => {
    const name = en(ABOUT_CONTENT.name);
    expect(intl.formatMessage({ id: ABOUT_CONTENT.greeting }, { name })).toBe(
      "Hello, I'm Alexander Durnev.",
    );
    expect(en(ABOUT_CONTENT.headline)).toBe(
      "Senior Full-Stack Engineer and System Design Specialist.",
    );
  });

  it("gives each lower card its heading", () => {
    const { headings } = ABOUT_CONTENT;
    expect(Object.entries(headings).map(([key, id]) => [key, en(id)])).toEqual([
      ["bio", "Bio"],
      ["roles", "Experience"],
      ["education", "Education"],
      ["languages", "Languages"],
      ["hobbies", "Hobbies"],
    ]);
  });

  it('writes a language as "name: level (CEFR)", the CEFR level left out for a native one', () => {
    const { languageLines } = ABOUT_CONTENT;
    const values = { name: "English", level: "fluent", cefr: "C1" };
    expect(intl.formatMessage({ id: languageLines.withCefr }, values)).toBe("English: fluent (C1)");
    expect(intl.formatMessage({ id: languageLines.plain }, values)).toBe("English: fluent");
  });

  it("joins the Role and Education facts with a middle dot, in messages", () => {
    const values = { company: "A", period: "B", place: "C", school: "S", year: "Y" };
    expect(intl.formatMessage({ id: ABOUT_CONTENT.roleLine }, values)).toBe("A · B · C");
    expect(intl.formatMessage({ id: ABOUT_CONTENT.education.line }, values)).toBe("S · C · Y");
  });

  it("labels the technologies line of a Role", () => {
    expect(en(ABOUT_CONTENT.technologiesLabel)).toBe("Technologies:");
  });

  it("links the LinkedIn and GitHub profiles, in that order", () => {
    expect(
      ABOUT_CONTENT.profiles.map((profile) => [profile.kind, en(profile.label), profile.url]),
    ).toEqual([
      ["linkedin", "LinkedIn", "https://www.linkedin.com/in/a-doo/"],
      ["github", "GitHub", "https://github.com/alexDou"],
    ]);
  });

  it("has the Hobbies, the Headline, the credo and the CV label", () => {
    expect(ABOUT_CONTENT.hobbies.length).toBeGreaterThan(0);
    expect(en(ABOUT_CONTENT.headline)).not.toBe("");
    expect(en(ABOUT_CONTENT.credo)).not.toBe("");
    expect(en(ABOUT_CONTENT.cv.label)).not.toBe("");
  });

  it("links the CV at a file that ships from public/", () => {
    expect(ABOUT_CONTENT.cv.url).toBe("/cv/alexander-durnev-cv-en.pdf");
    expect(existsSync(frontendFile(`public${ABOUT_CONTENT.cv.url}`))).toBe(true);
  });
});
