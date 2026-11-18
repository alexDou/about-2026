import { describe, expect, it } from "vitest";
import type { MessageId } from "../../../../../i18n";
import { buildSkillsText } from "../utils";
import type { SkillsTextFormat } from "../types";
import type { SkillGroupData } from "../../skill-group";

// Message ids stand in for their texts, so the tests do not depend on the wording.
const format: SkillsTextFormat = {
  message: (id) => `<${id}>`,
  date: ({ year, month }) => (month === undefined ? `${year}` : `${year}-${month}`),
  certified: "Certified",
};

const id = (name: string) => name as MessageId;

type TestSkill = SkillGroupData["skills"][number];
type TestCertificate = TestSkill["certificates"][number];

const skill = (name: string, certificates: readonly TestCertificate[] = []): TestSkill => ({
  id: name,
  name: id(`${name}.name`),
  overview: id(`${name}.overview`),
  certificates,
});

const certificate = (
  name: string,
  extras: Partial<Pick<TestCertificate, "date" | "ranking" | "verifyUrl">> = {},
): TestCertificate => ({
  id: name,
  title: id(`${name}.title`),
  issuer: id(`${name}.issuer`),
  date: { year: 2020, month: 7 },
  image: { avif: `${name}.avif`, webp: `${name}.webp` },
  ...extras,
});

const group = (
  name: string,
  skills: SkillGroupData["skills"] = [],
  subgroups: SkillGroupData["subgroups"] = [],
): SkillGroupData => ({ id: name, name: id(`${name}.name`), skills, subgroups });

describe("buildSkillsText", () => {
  it("is empty without groups", () => {
    expect(buildSkillsText([], format)).toBe("");
  });

  it("puts a group's own Skills one level in, each overview one deeper, two spaces a level", () => {
    const text = buildSkillsText([group("programming", [skill("typescript")])], format);
    expect(text).toBe(
      ["<programming.name>", "  <typescript.name>", "    <typescript.overview>"].join("\n"),
    );
  });

  it("puts a subgroup one level in and its Skills one deeper", () => {
    const text = buildSkillsText(
      [group("backend", [], [{ id: "apis", name: id("apis.name"), skills: [skill("rest")] }])],
      format,
    );
    expect(text).toBe(
      ["<backend.name>", "  <apis.name>", "    <rest.name>", "      <rest.overview>"].join("\n"),
    );
  });

  it("lists a group's own Skills before its subgroups, and keeps every order given", () => {
    const text = buildSkillsText(
      [
        group(
          "frontend",
          [skill("a"), skill("b")],
          [
            { id: "s1", name: id("s1.name"), skills: [skill("c")] },
            { id: "s2", name: id("s2.name"), skills: [skill("d")] },
          ],
        ),
        group("ai", [skill("e")]),
      ],
      format,
    );
    expect(text.split("\n").filter((line) => !line.includes("overview"))).toEqual([
      "<frontend.name>",
      "  <a.name>",
      "  <b.name>",
      "  <s1.name>",
      "    <c.name>",
      "  <s2.name>",
      "    <d.name>",
      "<ai.name>",
      "  <e.name>",
    ]);
  });

  it("adds a Certified line under the overview: title, issuer, date, ranking, verification URL", () => {
    const text = buildSkillsText(
      [
        group("programming", [
          skill("typescript", [
            certificate("ts", { ranking: id("ts.ranking"), verifyUrl: "https://example.com/ts" }),
          ]),
        ]),
      ],
      format,
    );
    expect(text.split("\n")).toEqual([
      "<programming.name>",
      "  <typescript.name>",
      "    <typescript.overview>",
      "    Certified: <ts.title>, <ts.issuer>, 2020-7, <ts.ranking>, https://example.com/ts",
    ]);
  });

  it("leaves out the ranking and the URL a Certificate does not have", () => {
    const text = buildSkillsText(
      [group("g", [skill("css", [certificate("wizard", { date: { year: 2025 } })])])],
      format,
    );
    expect(text.split("\n").at(-1)).toBe("    Certified: <wizard.title>, <wizard.issuer>, 2025");
  });

  it("gives each Certificate its own line, in order", () => {
    const text = buildSkillsText(
      [group("g", [skill("py", [certificate("one"), certificate("two")])])],
      format,
    );
    const lines = text.split("\n");
    expect(lines.slice(-2)).toEqual([
      "    Certified: <one.title>, <one.issuer>, 2020-7",
      "    Certified: <two.title>, <two.issuer>, 2020-7",
    ]);
  });

  it("indents a Certificate line with its Skill, under a subgroup too", () => {
    const text = buildSkillsText(
      [group("g", [], [{ id: "s", name: id("s.name"), skills: [skill("x", [certificate("c")])] }])],
      format,
    );
    expect(text.split("\n").at(-1)).toBe("      Certified: <c.title>, <c.issuer>, 2020-7");
  });

  it("takes the word Certified from the format, so it can be translated", () => {
    const text = buildSkillsText([group("g", [skill("x", [certificate("c")])])], {
      ...format,
      certified: "Zertifiziert",
    });
    expect(text).toContain("    Zertifiziert: ");
  });
});
