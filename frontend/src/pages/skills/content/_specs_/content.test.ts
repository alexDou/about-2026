import { createIntl } from "@formatjs/intl";
import { describe, expect, it } from "vitest";
import { enMessages, type MessageId } from "../../../../i18n";
import {
  CERTIFICATE_IDS,
  CERTIFICATE_IMAGE_DIR,
  SKILL_GROUP_IDS,
  SKILL_IDS,
  SKILL_SUBGROUP_IDS,
} from "../config";
import { SKILLS_CONTENT } from "..";
import type { Certificate, Skill } from "../types";

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

/** Fields that hold no message id: `id` is a name, `verifyUrl` and `image` are addresses. */
const NOT_IDS = new Set(["id", "verifyUrl", "image"]);

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

const SKILLS_IDS = Object.keys(enMessages).filter((id) => id.startsWith("skills."));

/** Every Skill, wherever it sits: directly in a group or inside a subgroup. */
const allSkills: Skill[] = SKILLS_CONTENT.groups.flatMap((group) => [
  ...group.skills,
  ...group.subgroups.flatMap((subgroup) => subgroup.skills),
]);

const allCertificates: Certificate[] = allSkills.flatMap((skill) => [...skill.certificates]);

describe("Skills content", () => {
  it("refers only to messages that exist and format, and every skills.* message is used", () => {
    const referenced = referencedIds(SKILLS_CONTENT);
    for (const id of referenced) expect(enMessages).toHaveProperty([id]);
    expect(referenced.map((id) => en(id as MessageId))).not.toContain("");
    expect([...new Set(referenced)].toSorted()).toEqual(SKILLS_IDS.toSorted());
  });

  it("has the eight Skill groups in order", () => {
    expect(SKILLS_CONTENT.groups.map((group) => [group.id, en(group.name)])).toEqual([
      ["programming", "Programming languages"],
      ["frontend", "Frontend"],
      ["backend", "Backend"],
      ["ai", "AI"],
      ["databases", "Databases & search"],
      ["cloudDevops", "Cloud & DevOps"],
      ["testing", "Testing & quality"],
      ["practice", "Engineering practice"],
    ]);
    expect(SKILLS_CONTENT.groups.map((group) => group.id)).toEqual([...SKILL_GROUP_IDS]);
  });

  it('gives only Frontend and Backend a Skill subgroup: "Architecture & ecosystem" and "APIs & services"', () => {
    expect(
      SKILLS_CONTENT.groups.map((group) => [
        group.id,
        group.subgroups.map((subgroup) => [subgroup.id, en(subgroup.name)]),
      ]),
    ).toEqual([
      ["programming", []],
      ["frontend", [["architectureEcosystem", "Architecture & ecosystem"]]],
      ["backend", [["apisServices", "APIs & services"]]],
      ["ai", []],
      ["databases", []],
      ["cloudDevops", []],
      ["testing", []],
      ["practice", []],
    ]);
  });

  it("lists Frontend's Skills as fixed with the Owner", () => {
    const frontend = SKILLS_CONTENT.groups.find((group) => group.id === "frontend");
    expect(frontend?.skills.map((skill) => en(skill.name))).toEqual([
      "React",
      "Next.js",
      "Preact",
      "Vue",
      "Svelte",
    ]);
    expect(frontend?.subgroups[0]?.skills.map((skill) => en(skill.name))).toEqual([
      "Frontend architecture",
      "Build tooling",
      "SSR & SSG",
      "Responsive UI",
      "Figma to UI",
      "UX principles",
      "Standards & accessibility",
      "SEO",
      "Performance optimisation",
      "CSS",
      "Libraries",
    ]);
  });

  it("puts the languages in their own group, Kotlin included", () => {
    const programming = SKILLS_CONTENT.groups.find((group) => group.id === "programming");
    expect(programming?.skills.map((skill) => skill.id)).toEqual(
      expect.arrayContaining(["typescript", "python", "kotlin"]),
    );
  });

  it("keeps a Skill group one level deep, and gives groups and subgroups no statement", () => {
    for (const group of SKILLS_CONTENT.groups) {
      expect(Object.keys(group).toSorted()).toEqual(["id", "name", "skills", "subgroups"]);
      for (const subgroup of group.subgroups) {
        expect(Object.keys(subgroup).toSorted()).toEqual(["id", "name", "skills"]);
      }
    }
  });

  it("gives every group and subgroup at least one Skill", () => {
    for (const group of SKILLS_CONTENT.groups) {
      expect(group.skills.length + group.subgroups.length).toBeGreaterThan(0);
      for (const subgroup of group.subgroups) expect(subgroup.skills.length).toBeGreaterThan(0);
    }
  });

  it("gives every Skill a name and an overview, and no rating, level or years", () => {
    expect(allSkills.length).toBeGreaterThan(0);
    for (const skill of allSkills) {
      expect(Object.keys(skill).toSorted()).toEqual(["certificates", "id", "name", "overview"]);
      expect(en(skill.name)).not.toBe("");
      expect(en(skill.overview)).not.toBe("");
    }
  });

  it("names the Skills that are decided (the rest comes from the questionnaires)", () => {
    const names = allSkills.map((skill) => en(skill.name));
    expect(names).toEqual(expect.arrayContaining(["TypeScript", "Python", "Kotlin", "Docker"]));
  });

  it("gives each Skill an id of its own, all from the configured list", () => {
    const ids = allSkills.map((skill) => skill.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.toSorted()).toEqual([...SKILL_IDS].toSorted());
  });

  it("gives each Skill group and subgroup an id of its own", () => {
    const subgroupIds = SKILLS_CONTENT.groups.flatMap((group) =>
      group.subgroups.map((subgroup) => subgroup.id),
    );
    expect(subgroupIds.toSorted()).toEqual([...SKILL_SUBGROUP_IDS].toSorted());
  });
});

describe("Certificates", () => {
  it("have unique ids, and each Certificate backs exactly one Skill", () => {
    const ids = allCertificates.map((certificate) => certificate.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.toSorted()).toEqual([...CERTIFICATE_IDS].toSorted());
  });

  it("sit on the Skill they back", () => {
    const backed = Object.fromEntries(
      allSkills
        .filter((skill) => skill.certificates.length > 0)
        .map((skill) => [skill.id, skill.certificates.map((certificate) => certificate.id)]),
    );
    expect(backed).toEqual({
      typescript: ["testdomeTypescript"],
      python: ["testdomePython", "educativeCleanCodePython"],
      kotlin: ["educativeKotlin"],
      css: ["modernCssWizard"],
      docker: ["educativeDocker"],
      bash: ["udemyBash"],
      openaiSdk: ["udemyLlmEngineering"],
      mcp: ["udemyAgenticAi"],
      elasticsearch: ["udemyElasticsearch"],
    });
  });

  it("carry a title, an issuer, a date and an image, and keep the optional parts optional", () => {
    for (const certificate of allCertificates) {
      expect(en(certificate.title)).not.toBe("");
      expect(en(certificate.issuer)).not.toBe("");
      expect(certificate.date.year).toBeGreaterThanOrEqual(2000);
      expect(certificate.image).toBe(`${CERTIFICATE_IMAGE_DIR}/${certificate.id}.webp`);
    }
    // Optional parts, when present, are well formed.
    const months = allCertificates.flatMap(({ date }) =>
      date.month === undefined ? [] : [date.month],
    );
    expect(months.every((month) => month >= 1 && month <= 12)).toBe(true);
    const rankings = allCertificates.flatMap(({ ranking }) => (ranking ? [en(ranking)] : []));
    expect(rankings).not.toContain("");
    const urls = allCertificates.flatMap(({ verifyUrl }) => (verifyUrl ? [verifyUrl] : []));
    expect(urls.every((url) => url.startsWith("https://"))).toBe(true);
  });

  it("rank the two TestDome tests in the top 10%, and nothing else", () => {
    expect(
      allCertificates
        .filter((certificate) => certificate.ranking)
        .map((certificate) => [certificate.id, certificate.ranking && en(certificate.ranking)]),
    ).toEqual([
      ["testdomeTypescript", "Top 10%"],
      ["testdomePython", "Top 10%"],
    ]);
  });

  it("date them as decided: the Elasticsearch course 2016, CSS Wizard 2026 with no month", () => {
    const dates = Object.fromEntries(
      allCertificates.map((certificate) => [certificate.id, certificate.date]),
    );
    expect(dates["udemyElasticsearch"]).toEqual({ year: 2016, month: 7 });
    expect(dates["modernCssWizard"]).toEqual({ year: 2026 });
    expect(dates["testdomeTypescript"]).toEqual({ year: 2020, month: 7 });
  });

  it("name the issuers", () => {
    expect(
      Object.fromEntries(
        allCertificates.map((certificate) => [certificate.id, en(certificate.issuer)]),
      ),
    ).toEqual({
      testdomeTypescript: "TestDome",
      testdomePython: "TestDome",
      educativeCleanCodePython: "Educative",
      educativeKotlin: "Educative",
      modernCssWizard: "modern.css",
      educativeDocker: "Educative",
      udemyBash: "Udemy",
      udemyLlmEngineering: "Udemy",
      udemyAgenticAi: "Udemy",
      udemyElasticsearch: "Udemy",
    });
  });
});
