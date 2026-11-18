import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { act, fireEvent, render, screen } from "@octanejs/testing-library";
import type { SkillGroupData } from "../../skill-group";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { intlWrapper } from "../../../../../i18n";
import type { MessageId } from "../../../../../i18n";
import { COPIED_MS } from "../config";
import { CopySkills } from "..";

const css = readFileSync(resolve(import.meta.dirname, "../styles.module.css"), "utf8");

const writeText = vi.fn<(text: string) => Promise<void>>();

const GROUPS: SkillGroupData[] = [
  {
    id: "programming",
    name: "skills.group.programming.name",
    skills: [
      {
        id: "typescript",
        name: "skills.skill.typescript.name",
        overview: "skills.skill.typescript.overview" as MessageId,
        certificates: [
          {
            id: "testdomeTypescript",
            title: "skills.certificate.testdomeTypescript.title",
            issuer: "skills.issuer.testdome",
            date: { year: 2020, month: 7 },
            ranking: "skills.certificate.testdomeTypescript.ranking",
            image: { avif: "a.avif", webp: "a.webp" },
          },
        ],
      },
    ],
    subgroups: [],
  },
];

const renderCopy = (overrides: Parameters<typeof intlWrapper>[0] = {}) =>
  render(CopySkills, { props: { groups: GROUPS }, wrapper: intlWrapper(overrides) });

const click = async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Copy skills" }));
  });
};

beforeEach(() => {
  vi.useFakeTimers();
  writeText.mockReset();
  writeText.mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("CopySkills", () => {
  it("is a button named by the 'skills.copySkills' message", () => {
    renderCopy({ "skills.copySkills": "Fähigkeiten kopieren" });
    expect(screen.getByRole("button", { name: "Fähigkeiten kopieren" })).toBeInTheDocument();
  });

  it("shows no 'Copied' before a copy, and has a status region ready to announce it", () => {
    renderCopy();
    expect(screen.queryByText("Copied")).toBeNull();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("copies every Skill as structured text, in the Visitor's language", async () => {
    renderCopy({ "skills.copyCertified": "Zertifiziert" });
    await click();
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0]![0].split("\n")).toEqual([
      "Programming languages",
      "  TypeScript",
      "    Expert, working confidently with complex types and interfaces.",
      "    Zertifiziert: TypeScript, TestDome, Jul 2020, Top 10%",
    ]);
  });

  it("shows 'Copied' in the status region, so screen readers announce it", async () => {
    renderCopy({ "skills.copied": "Kopiert" });
    await click();
    expect(screen.getByRole("status")).toHaveTextContent("Kopiert");
  });

  it("takes 'Copied' away after a moment", async () => {
    renderCopy();
    await click();
    act(() => {
      vi.advanceTimersByTime(COPIED_MS);
    });
    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("shows no 'Copied' when the browser refuses the copy", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    renderCopy();
    await click();
    expect(screen.getByRole("status").textContent).toBe("");
  });
});

describe("CopySkills stylesheet", () => {
  const rule = (selector: string) => {
    const match = new RegExp(`${selector.replaceAll(".", "\\.")}\\s*{([^}]*)}`).exec(css);
    expect(match, `a rule for ${selector}`).not.toBeNull();
    return match![1]!;
  };

  it("makes the button as tall as the row's other control, with rounded ends", () => {
    expect(rule(".copy-skills__button")).toMatch(/height:\s*var\(--control-height\)/);
    expect(rule(".copy-skills__button")).toMatch(/border-radius:/);
  });

  it("sits on the page's own colour, with dark text and an About-coloured border", () => {
    const button = rule(".copy-skills__button");
    expect(button).toMatch(/background(-color)?:\s*var\(--panel-skills\)/);
    expect(button).toMatch(/color:\s*var\(--text-on-light\)/);
    expect(button).toMatch(/border:\s*1px solid var\(--panel-about\)/);
  });

  it("is a darker colour on hover, reached with a short transition", () => {
    expect(rule(".copy-skills__button:hover")).toMatch(
      /background(-color)?:\s*var\(--copy-skills-hover\)/,
    );
    expect(rule(".copy-skills")).toMatch(/--copy-skills-hover:\s*color-mix\(.*black/);
    expect(rule(".copy-skills__button")).toMatch(/transition:\s*background-color/);
  });

  it("has a 1rem font", () => {
    expect(rule(".copy-skills__button")).toMatch(/font-size:\s*1rem/);
  });

  it("lays the status and the button out in a flex row with a gap", () => {
    expect(rule(".copy-skills")).toMatch(/display:\s*flex/);
    expect(rule(".copy-skills")).toMatch(/gap:/);
  });
});
