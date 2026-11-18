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
  image: {
    avif: `${CERTIFICATE_IMAGE_DIR}/${id}.avif`,
    webp: `${CERTIFICATE_IMAGE_DIR}/${id}.webp`,
  },
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
 * The Skills Panel's content: which message each piece of it reads. The Skills are the ones fixed
 * with the Owner in the questionnaires (`docs_src/skills/`, Unit 3.1). The Certificates are the
 * ones decided in the grilling; TestDome's and CSS Wizard's carry no verification link.
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
        certificate(
          "educativeCleanCodePython",
          "educative",
          { year: 2025, month: 6 },
          {
            verifyUrl: "https://www.educative.io/verify-certificate/qjv3oKCJ00B27kjW9SqxmPE85PWktK",
          },
        ),
      ]),
      skill("rust"),
      skill("php"),
      skill("kotlin", [
        certificate(
          "educativeKotlin",
          "educative",
          { year: 2025, month: 6 },
          {
            verifyUrl: "https://www.educative.io/verify-certificate/MjprXLCvrQJ1pXJkMHG5mjW60jqvIZ",
          },
        ),
      ]),
    ]),
    group(
      "frontend",
      [],
      [
        subgroup("frameworksLibraries", [
          skill("react"),
          skill("nextjs"),
          skill("preact"),
          skill("vue"),
          skill("svelte"),
        ]),
        subgroup("architectureEcosystem", [
          skill("frontendArchitecture"),
          skill("buildTooling"),
          skill("ssrSsg"),
          skill("responsiveUi"),
          skill("figmaToUi"),
          skill("uxPrinciples"),
          skill("standardsAccessibility"),
          skill("seo"),
          skill("frontendPerformance"),
          skill("css", [certificate("modernCssWizard", "modernCss", { year: 2026 })]),
          skill("frontendPackages"),
        ]),
      ],
    ),
    group(
      "backend",
      [],
      [
        subgroup("runtimesFrameworks", [
          skill("nodejs"),
          skill("expressKoa"),
          skill("elysia"),
          skill("nestHapiSails"),
          skill("apollo"),
          skill("fastapi"),
          skill("actix"),
          skill("phpFrameworks"),
        ]),
        subgroup("apisServices", [
          skill("rest"),
          skill("graphql"),
          skill("websockets"),
          skill("sse"),
          skill("webrtc"),
          skill("openapi"),
          skill("kafka"),
          skill("grpcAmqpMqtt"),
        ]),
      ],
    ),
    group(
      "ai",
      [],
      [
        subgroup("sdksAgents", [
          skill("openaiSdk", [
            certificate(
              "udemyLlmEngineering",
              "udemy",
              { year: 2025, month: 7 },
              { verifyUrl: "https://ude.my/UC-7d2da67c-8d0e-4da8-973c-e291442941eb" },
            ),
          ]),
          skill("crewai"),
          skill("langgraph"),
          skill("mcp", [
            certificate(
              "udemyAgenticAi",
              "udemy",
              { year: 2026, month: 1 },
              { verifyUrl: "https://ude.my/UC-a7efde5a-28b4-450e-bbfb-eb00ae6d5269" },
            ),
          ]),
          skill("agentCreation"),
        ]),
        subgroup("aiDevelopment", [
          skill("claudeCodex"),
          skill("antigravity"),
          skill("opencode"),
          skill("ragObsidian"),
          skill("promptsSkillsRules"),
        ]),
      ],
    ),
    group(
      "databases",
      [],
      [
        subgroup("sql", [skill("postgresMysql"), skill("sqlite")]),
        subgroup("nosql", [
          skill("redis"),
          skill("mongodb"),
          skill("dynamodb"),
          skill("rethinkdb"),
          skill("scylladb"),
          skill("elasticsearch", [
            certificate(
              "udemyElasticsearch",
              "udemy",
              { year: 2016, month: 7 },
              { verifyUrl: "https://ude.my/UC-50CLL29G" },
            ),
          ]),
        ]),
        subgroup("ormsDrivers", [
          skill("prisma"),
          skill("typeorm"),
          skill("sqlalchemy"),
          skill("mongoose"),
        ]),
      ],
    ),
    group("cloudDevops", [
      skill("docker", [
        certificate(
          "educativeDocker",
          "educative",
          { year: 2025, month: 6 },
          {
            verifyUrl: "https://www.educative.io/verify-certificate/An5VrvSl8Ov7k6y2gt2lgpYE0pkDF9",
          },
        ),
      ]),
      skill("kubernetes"),
      skill("terraformHelm"),
      skill("gitlabJenkins"),
      skill("aws"),
      skill("googleCloud"),
      skill("nginxApache"),
      skill("linux", [
        certificate(
          "udemyBash",
          "udemy",
          { year: 2019, month: 7 },
          { verifyUrl: "https://ude.my/UC-DBQU5RN9" },
        ),
      ]),
      skill("monitoring"),
    ]),
    group("testing", [
      skill("jestVitestMocha"),
      skill("pytest"),
      skill("rtlMsw"),
      skill("cypressPlaywright"),
      skill("cucumber"),
      skill("eslintPrettierOxlint"),
      skill("ruffClippy"),
      skill("semgrep"),
    ]),
    group("practice", [
      skill("designPrinciples"),
      skill("cleanCode"),
      skill("dddTddBdd"),
      skill("sdd"),
      skill("refactoring"),
      skill("codeReview"),
      skill("techDocumentation"),
      skill("agile"),
    ]),
  ],
};
