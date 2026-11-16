/** The Skill groups, in the order they show. */
export const SKILL_GROUP_IDS = [
  "frontend",
  "backend",
  "databases",
  "cloudDevops",
  "testing",
  "ai",
  "practice",
] as const;

/** The Skill subgroups: Frontend's and Backend's. */
export const SKILL_SUBGROUP_IDS = ["architectureEcosystem", "apisArchitecture"] as const;

/**
 * The Skills. Placeholders until the questionnaires fix the lists (Unit 3.1): every Skill that
 * backs a Certificate is here, plus a few per group so the stages after this one have content.
 */
export const SKILL_IDS = [
  "react",
  "nextjs",
  "designSystems",
  "css",
  "typescript",
  "python",
  "kotlin",
  "rest",
  "graphql",
  "postgresql",
  "elasticsearch",
  "docker",
  "bash",
  "vitest",
  "playwright",
  "openaiSdk",
  "mcp",
  "systemDesign",
  "cleanArchitecture",
] as const;

/** The Certificates the Owner holds that back a Skill. */
export const CERTIFICATE_IDS = [
  "testdomeTypescript",
  "testdomePython",
  "educativeCleanCodePython",
  "educativeKotlin",
  "modernCssWizard",
  "educativeDocker",
  "udemyBash",
  "udemyLlmEngineering",
  "udemyAgenticAi",
  "udemyElasticsearch",
] as const;

/** The issuers of the Certificates. */
export const CERTIFICATE_ISSUER_IDS = ["testdome", "educative", "modernCss", "udemy"] as const;

/** Where the Certificate images are served from (`public/certificates/`). */
export const CERTIFICATE_IMAGE_DIR = "/certificates";
