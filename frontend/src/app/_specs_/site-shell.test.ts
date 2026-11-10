// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(`../../../${path}`, import.meta.url), "utf8");

type Group = { agents: string[]; rules: string[] };

/** Splits a robots.txt into its groups: consecutive User-agent lines, then their rules. */
function parseRobots(text: string): Group[] {
  const groups: Group[] = [];
  let current: Group | undefined;
  let inRules = false;
  for (const raw of text.split("\n")) {
    const line = raw.replace(/#.*/, "").trim();
    if (!line) continue;
    const [field, ...rest] = line.split(":");
    const key = (field ?? "").trim().toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") {
      if (!current || inRules) groups.push((current = { agents: [], rules: [] }));
      inRules = false;
      current.agents.push(value);
    } else if (current && (key === "disallow" || key === "allow")) {
      inRules = true;
      current.rules.push(`${key}: ${value}`);
    }
  }
  return groups;
}

describe("index.html", () => {
  it("tells search engines not to index or follow", () => {
    expect(read("index.html")).toContain('<meta name="robots" content="noindex, nofollow" />');
  });
});

describe("robots.txt", () => {
  const groups = parseRobots(read("public/robots.txt"));
  const groupFor = (agent: string) =>
    groups.find((g) => g.agents.some((a) => a.toLowerCase() === agent.toLowerCase()));

  it("lets ordinary crawlers in, so they read the noindex", () => {
    const everyone = groupFor("*");
    expect(everyone).toBeDefined();
    expect(everyone?.rules.filter((r) => r === "disallow: /")).toEqual([]);
  });

  it.each(["GPTBot", "ClaudeBot", "CCBot", "Google-Extended"])(
    "keeps the AI-training crawler %s out",
    (agent) => {
      expect(groupFor(agent)?.rules).toEqual(["disallow: /"]);
    },
  );
});
