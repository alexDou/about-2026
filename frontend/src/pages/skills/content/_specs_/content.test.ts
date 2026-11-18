import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
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
import type { Certificate, Skill, SkillGroup } from "../types";

const intl = createIntl({
  locale: "en",
  defaultLocale: "en",
  messages: enMessages,
  onError: (error) => {
    throw error;
  },
});

/** A path under `frontend/`. */
const frontendFile = (path: string) => resolve(import.meta.dirname, "../../../../..", path);

/**
 * Byte budget per Certificate image file, which a phone downloads when the Certificate view opens:
 * the largest shipped file plus about a quarter, so a 2x regression fails.
 */
const IMAGE_BUDGET_BYTES = 180_000;

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

/**
 * The `skills.*` messages the Skills components read by id, so the content never refers to them.
 * Their text has values to fill (`{name}`), checked where they show (the components' tests).
 */
const COMPONENT_MESSAGES: readonly string[] = ["skills.overviewToggle"];

const SKILLS_IDS = Object.keys(enMessages).filter(
  (id) => id.startsWith("skills.") && !COMPONENT_MESSAGES.includes(id),
);

/** Every Skill, wherever it sits: directly in a group or inside a subgroup. */
const allSkills: Skill[] = SKILLS_CONTENT.groups.flatMap((group) => [
  ...group.skills,
  ...group.subgroups.flatMap((subgroup) => subgroup.skills),
]);

/** A group's Skill names: its own first, then one list per subgroup. */
const skillNames = (group: SkillGroup): string[][] => [
  group.skills.map((skill) => en(skill.name)),
  ...group.subgroups.map((subgroup) => subgroup.skills.map((skill) => en(skill.name))),
];

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

  it("gives each Skill group its subgroups", () => {
    expect(
      SKILLS_CONTENT.groups.map((group) => [
        group.id,
        group.subgroups.map((subgroup) => [subgroup.id, en(subgroup.name)]),
      ]),
    ).toEqual([
      ["programming", []],
      [
        "frontend",
        [
          ["frameworksLibraries", "Frameworks & libraries"],
          ["architectureEcosystem", "Architecture & ecosystem"],
        ],
      ],
      [
        "backend",
        [
          ["runtimesFrameworks", "Runtimes & frameworks"],
          ["apisServices", "APIs & services"],
        ],
      ],
      [
        "ai",
        [
          ["sdksAgents", "SDKs & agent frameworks"],
          ["aiDevelopment", "AI-assisted development"],
        ],
      ],
      [
        "databases",
        [
          ["sql", "SQL"],
          ["nosql", "NoSQL"],
          ["ormsDrivers", "ORMs & drivers"],
        ],
      ],
      ["cloudDevops", []],
      ["testing", []],
      ["practice", []],
    ]);
  });

  it("lists each group's Skills as fixed with the Owner: its own, then each subgroup's, in order", () => {
    expect(
      Object.fromEntries(SKILLS_CONTENT.groups.map((group) => [group.id, skillNames(group)])),
    ).toEqual({
      programming: [["TypeScript", "Python", "Rust", "PHP", "Kotlin"]],
      frontend: [
        [],
        ["React", "Next.js", "Preact", "Vue", "Svelte"],
        [
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
          "Packages",
        ],
      ],
      backend: [
        [],
        [
          "Node.js",
          "Express & Koa",
          "ElysiaJS",
          "NestJS, Hapi & Sails.js",
          "Apollo",
          "FastAPI",
          "Actix",
          "Yii2, Zend Framework & Laravel",
        ],
        [
          "RESTful APIs",
          "GraphQL",
          "WebSockets, Socket.io",
          "Server-Sent Events",
          "WebRTC",
          "OpenAPI/Swagger",
          "Kafka",
          "gRPC, AMQP and MQTT",
        ],
      ],
      ai: [
        [],
        ["OpenAI SDK", "CrewAI", "LangGraph", "MCP", "Agent creation: Google ADK & Amazon Bedrock"],
        [
          "Claude Code & Codex",
          "Antigravity",
          "OpenCode",
          "RAG, Obsidian & Karpathy Wiki",
          "Prompts, skills & rules",
        ],
      ],
      databases: [
        [],
        ["PostgreSQL & MySQL", "SQLite"],
        ["Redis", "MongoDB", "DynamoDB", "RethinkDB", "ScyllaDB", "Elasticsearch"],
        ["Prisma", "TypeORM", "SQLAlchemy", "Mongoose & the MongoDB Node.js driver"],
      ],
      cloudDevops: [
        [
          "Docker & Docker Compose",
          "Kubernetes",
          "Terraform & Helm",
          "GitLab CI & Jenkins",
          "AWS",
          "Google Cloud",
          "Nginx & Apache",
          "Linux",
          "Monitoring & Observability",
        ],
      ],
      testing: [
        [
          "Jest, Vitest & Mocha",
          "pytest",
          "React Testing Library & MSW",
          "Cypress & Playwright",
          "Cucumber & Gherkin",
          "ESLint, Prettier & oxlint",
          "Ruff & Clippy",
          "Semgrep",
        ],
      ],
      practice: [
        [
          "SOLID, DRY, KISS, YAGNI & design patterns",
          "Clean code, clean architecture & deep modules",
          "DDD, TDD & BDD",
          "Spec-driven development",
          "Legacy code & refactoring",
          "Code review",
          "Technical documentation & ADRs",
          "Agile: Scrum & Kanban",
        ],
      ],
    });
  });

  it("holds a group's Skills directly or in subgroups, never both", () => {
    for (const group of SKILLS_CONTENT.groups) {
      expect([group.id, group.skills.length === 0 || group.subgroups.length === 0]).toEqual([
        group.id,
        true,
      ]);
    }
  });

  it("gives the Skills the Owner moved their words (2026-11-18)", () => {
    expect(en("skills.skill.websockets.overview")).toBe(
      "Up-to-date knowledge. Socket.io: ready to use from day one.",
    );
    expect(en("skills.skill.grpcAmqpMqtt.overview")).toBe("Application-level knowledge.");
  });

  it("says Kotlin has no production experience", () => {
    expect(en("skills.skill.kotlin.overview")).toMatch(/no production experience/i);
  });

  it("leaves no placeholder text", () => {
    for (const id of SKILLS_IDS) expect(en(id as MessageId)).not.toMatch(/placeholder/i);
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
      linux: ["udemyBash"],
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
      expect(certificate.image).toEqual({
        avif: `${CERTIFICATE_IMAGE_DIR}/${certificate.id}.avif`,
        webp: `${CERTIFICATE_IMAGE_DIR}/${certificate.id}.webp`,
      });
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

  it.each(allCertificates.flatMap(({ image }) => [image.avif, image.webp]))(
    "ship %s from public/ within its byte budget",
    (path) => {
      const file = frontendFile(`public${path}`);
      expect(existsSync(file)).toBe(true);
      expect(statSync(file).size).toBeLessThan(IMAGE_BUDGET_BYTES);
    },
  );

  it("link each to the issuer's own verification page, none for TestDome or CSS Wizard", () => {
    expect(
      Object.fromEntries(
        allCertificates.map((certificate) => [certificate.id, certificate.verifyUrl]),
      ),
    ).toEqual({
      testdomeTypescript: undefined,
      testdomePython: undefined,
      educativeCleanCodePython:
        "https://www.educative.io/verify-certificate/qjv3oKCJ00B27kjW9SqxmPE85PWktK",
      educativeKotlin: "https://www.educative.io/verify-certificate/MjprXLCvrQJ1pXJkMHG5mjW60jqvIZ",
      modernCssWizard: undefined,
      educativeDocker: "https://www.educative.io/verify-certificate/An5VrvSl8Ov7k6y2gt2lgpYE0pkDF9",
      udemyBash: "https://ude.my/UC-DBQU5RN9",
      udemyLlmEngineering: "https://ude.my/UC-7d2da67c-8d0e-4da8-973c-e291442941eb",
      udemyAgenticAi: "https://ude.my/UC-a7efde5a-28b4-450e-bbfb-eb00ae6d5269",
      udemyElasticsearch: "https://ude.my/UC-50CLL29G",
    });
  });
});
