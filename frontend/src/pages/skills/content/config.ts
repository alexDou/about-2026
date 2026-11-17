/** The Skill groups, in the order they show. */
export const SKILL_GROUP_IDS = [
  "programming",
  "frontend",
  "backend",
  "ai",
  "databases",
  "cloudDevops",
  "testing",
  "practice",
] as const;

/** The Skill subgroups: Frontend's, Backend's, AI's and Databases & search's. */
export const SKILL_SUBGROUP_IDS = [
  "architectureEcosystem",
  "apisServices",
  "aiDevelopment",
  "sql",
  "nosql",
  "ormsDrivers",
] as const;

/**
 * The Skills. Programming languages, Frontend, Backend, AI, Databases & search and Cloud & DevOps
 * are fixed with the Owner; the rest are placeholders until their questionnaires fix them (Unit
 * 3.1): every Skill that backs a Certificate is here, plus a few per group so the stages after this
 * one have content.
 */
export const SKILL_IDS = [
  "react",
  "nextjs",
  "preact",
  "vue",
  "svelte",
  "frontendArchitecture",
  "buildTooling",
  "ssrSsg",
  "responsiveUi",
  "figmaToUi",
  "uxPrinciples",
  "standardsAccessibility",
  "seo",
  "performance",
  "css",
  "libraries",
  "typescript",
  "python",
  "rust",
  "php",
  "kotlin",
  "nodejs",
  "expressKoa",
  "socketIo",
  "apollo",
  "elysia",
  "nestHapiSails",
  "fastapi",
  "actix",
  "phpFrameworks",
  "rest",
  "graphql",
  "websockets",
  "sse",
  "webrtc",
  "openapi",
  "kafka",
  "protocols",
  "postgresMysql",
  "sqlite",
  "redis",
  "mongodb",
  "dynamodb",
  "rethinkdb",
  "scylladb",
  "elasticsearch",
  "prisma",
  "typeorm",
  "sqlalchemy",
  "mongoose",
  "docker",
  "kubernetes",
  "terraformHelm",
  "gitlabJenkins",
  "aws",
  "googleCloud",
  "nginxApache",
  "linux",
  "monitoring",
  "vitest",
  "playwright",
  "openaiSdk",
  "crewai",
  "langgraph",
  "mcp",
  "agentCreation",
  "claudeCodex",
  "antigravity",
  "opencode",
  "ragMemory",
  "promptsSkillsRules",
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
