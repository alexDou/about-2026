import { CERTIFICATE_IMAGE_DIR } from "./config";
import type {
  Certificate,
  CertificateDate,
  CertificateId,
  CertificateIssuerId,
  Skill,
  SkillGroup,
  SkillGroupId,
  SkillId,
  SkillSubgroup,
  SkillSubgroupId,
  SkillsContent,
} from "./types";

const skill = (id: SkillId, certificates: readonly Certificate[] = []): Skill => ({
  id,
  name: `skills.skill.${id}.name`,
  overview: `skills.skill.${id}.overview`,
  certificates,
});

type CertificateExtras = Pick<Certificate, "ranking" | "verifyUrl">;

const certificate = (
  id: CertificateId,
  issuer: CertificateIssuerId,
  date: CertificateDate,
  extras: CertificateExtras = {},
): Certificate => ({
  id,
  title: `skills.certificate.${id}.title`,
  issuer: `skills.issuer.${issuer}`,
  date,
  image: `${CERTIFICATE_IMAGE_DIR}/${id}.webp`,
  ...extras,
});

const subgroup = (id: SkillSubgroupId, skills: readonly Skill[]): SkillSubgroup => ({
  id,
  name: `skills.subgroup.${id}.name`,
  skills,
});

const group = (
  id: SkillGroupId,
  skills: readonly Skill[],
  subgroups: readonly SkillSubgroup[] = [],
): SkillGroup => ({
  id,
  name: `skills.group.${id}.name`,
  skills,
  subgroups,
});

/**
 * The Skills Panel's content: which message each piece of it reads. Programming languages,
 * Frontend, Backend and AI are fixed with the Owner; the rest are placeholders until their
 * questionnaires (Unit 3.1) fix them. The Certificates are the ones decided in the grilling,
 * without verification links until Unit 3.2.
 */
export const SKILLS_CONTENT: SkillsContent = {
  groups: [
    group("programming", [
      skill("typescript", [
        certificate(
          "testdomeTypescript",
          "testdome",
          { year: 2020, month: 7 },
          { ranking: "skills.certificate.testdomeTypescript.ranking" },
        ),
      ]),
      skill("python", [
        certificate(
          "testdomePython",
          "testdome",
          { year: 2022, month: 3 },
          { ranking: "skills.certificate.testdomePython.ranking" },
        ),
        certificate("educativeCleanCodePython", "educative", { year: 2025, month: 6 }),
      ]),
      skill("rust"),
      skill("php"),
      skill("kotlin", [certificate("educativeKotlin", "educative", { year: 2025, month: 6 })]),
    ]),
    group(
      "frontend",
      [skill("react"), skill("nextjs"), skill("preact"), skill("vue"), skill("svelte")],
      [
        subgroup("architectureEcosystem", [
          skill("frontendArchitecture"),
          skill("buildTooling"),
          skill("ssrSsg"),
          skill("responsiveUi"),
          skill("figmaToUi"),
          skill("uxPrinciples"),
          skill("standardsAccessibility"),
          skill("seo"),
          skill("performance"),
          skill("css", [certificate("modernCssWizard", "modernCss", { year: 2026 })]),
          skill("libraries"),
        ]),
      ],
    ),
    group(
      "backend",
      [
        skill("nodejs"),
        skill("expressKoa"),
        skill("socketIo"),
        skill("apollo"),
        skill("elysia"),
        skill("nestHapiSails"),
        skill("fastapi"),
        skill("actix"),
        skill("phpFrameworks"),
      ],
      [
        subgroup("apisServices", [
          skill("rest"),
          skill("graphql"),
          skill("websockets"),
          skill("sse"),
          skill("webrtc"),
          skill("openapi"),
          skill("kafka"),
          skill("protocols"),
        ]),
      ],
    ),
    group(
      "ai",
      [
        skill("openaiSdk", [certificate("udemyLlmEngineering", "udemy", { year: 2025, month: 7 })]),
        skill("crewai"),
        skill("langgraph"),
        skill("mcp", [certificate("udemyAgenticAi", "udemy", { year: 2026, month: 1 })]),
        skill("agentCreation"),
      ],
      [
        subgroup("aiDevelopment", [
          skill("claudeCodex"),
          skill("antigravity"),
          skill("opencode"),
          skill("ragMemory"),
          skill("promptsSkillsRules"),
        ]),
      ],
    ),
    group("databases", [
      skill("postgresql"),
      skill("elasticsearch", [
        certificate("udemyElasticsearch", "udemy", { year: 2016, month: 7 }),
      ]),
    ]),
    group("cloudDevops", [
      skill("docker", [certificate("educativeDocker", "educative", { year: 2025, month: 6 })]),
      skill("bash", [certificate("udemyBash", "udemy", { year: 2019, month: 7 })]),
    ]),
    group("testing", [skill("vitest"), skill("playwright")]),
    group("practice", [skill("systemDesign"), skill("cleanArchitecture")]),
  ],
};
