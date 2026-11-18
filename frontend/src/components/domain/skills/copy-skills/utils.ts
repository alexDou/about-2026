import type { SkillGroupData } from "../skill-group";
import type { SkillsTextFormat } from "./types";

const INDENT = "  ";

type TextSkill = SkillGroupData["skills"][number];

const indented = (level: number, text: string) => `${INDENT.repeat(level)}${text}`;

function skillLines(skill: TextSkill, level: number, format: SkillsTextFormat): string[] {
  const certificates = skill.certificates.map((certificate) => {
    const parts = [
      format.message(certificate.title),
      format.message(certificate.issuer),
      format.date(certificate.date),
      ...(certificate.ranking === undefined ? [] : [format.message(certificate.ranking)]),
      ...(certificate.verifyUrl === undefined ? [] : [certificate.verifyUrl]),
    ];
    return indented(level + 1, `${format.certified}: ${parts.join(", ")}`);
  });
  return [
    indented(level, format.message(skill.name)),
    indented(level + 1, format.message(skill.overview)),
    ...certificates,
  ];
}

/**
 * All the Skills as plain, structured text, whatever is open on screen: a line per group,
 * subgroup, Skill and overview, and a "Certified:" line per Certificate, two spaces a level. A
 * group lists its own Skills before its subgroups, as the page does.
 */
export function buildSkillsText(
  groups: readonly SkillGroupData[],
  format: SkillsTextFormat,
): string {
  return groups
    .flatMap((group) => [
      format.message(group.name),
      ...group.skills.flatMap((skill) => skillLines(skill, 1, format)),
      ...group.subgroups.flatMap((subgroup) => [
        indented(1, format.message(subgroup.name)),
        ...subgroup.skills.flatMap((skill) => skillLines(skill, 2, format)),
      ]),
    ])
    .join("\n");
}
