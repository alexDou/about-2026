import { act, fireEvent, render, screen } from "@octanejs/testing-library";
import { afterEach, describe, expect, it } from "vitest";
import { intlWrapper } from "../../../../../i18n";
import { headingsOf, overviews$, reset, skillOpen, toggleSkill } from "../../overviews";
import { SkillEntry } from "../SkillEntry.tsrx";

const SKILL = {
  id: "typescript",
  name: "skills.skill.typescript.name",
  overview: "skills.skill.typescript.overview",
  certificates: [],
} as const;

const TESTDOME = {
  id: "testdomePython",
  title: "skills.certificate.testdomePython.title",
  issuer: "skills.issuer.testdome",
  date: { year: 2022, month: 3 },
  image: { avif: "/certificates/testdomePython.avif", webp: "/certificates/testdomePython.webp" },
} as const;

const EDUCATIVE = {
  id: "educativeCleanCodePython",
  title: "skills.certificate.educativeCleanCodePython.title",
  issuer: "skills.issuer.educative",
  date: { year: 2025, month: 6 },
  image: {
    avif: "/certificates/educativeCleanCodePython.avif",
    webp: "/certificates/educativeCleanCodePython.webp",
  },
} as const;

const GROUP = { id: "programming", skills: [{ id: "typescript" }], subgroups: [] };

function setup(certificates: readonly (typeof TESTDOME | typeof EDUCATIVE)[] = []) {
  return render(SkillEntry, {
    props: { skill: { ...SKILL, certificates }, headings: headingsOf(GROUP) },
    wrapper: intlWrapper({
      "skills.skill.typescript.name": "TypeScript",
      "skills.skill.typescript.overview": "Expert.",
    }),
  });
}

afterEach(reset);

describe("SkillEntry", () => {
  it("shows the Skill's name as plain text, not as a control", () => {
    setup();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "TypeScript" })).not.toBeInTheDocument();
  });

  it("has an arrow button named by the Skill, closed at first with the overview hidden", () => {
    setup();
    const arrow = screen.getByRole("button", { name: "Overview of TypeScript" });
    expect(arrow).toHaveAttribute("type", "button");
    expect(arrow).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Expert.").closest("[inert]")).not.toBeNull();
  });

  it("points the arrow at the overview it controls", () => {
    setup();
    const arrow = screen.getByRole("button", { name: "Overview of TypeScript" });
    const overview = document.getElementById(arrow.getAttribute("aria-controls") ?? "");
    expect(overview).toContainElement(screen.getByText("Expert."));
  });

  it("opens the overview on a click and closes it on the next", () => {
    setup();
    const arrow = screen.getByRole("button", { name: "Overview of TypeScript" });
    fireEvent.click(arrow);
    expect(arrow).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Expert.").closest("[inert]")).toBeNull();
    expect(skillOpen(overviews$.get(), "typescript")).toBe(true);
    fireEvent.click(arrow);
    expect(arrow).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Expert.").closest("[inert]")).not.toBeNull();
  });

  it("follows the shared state, so a heading can open it", () => {
    setup();
    act(() => toggleSkill(headingsOf(GROUP), "typescript"));
    expect(screen.getByRole("button", { name: "Overview of TypeScript" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  describe("Certificates", () => {
    it("has no link for a Skill without a Certificate", () => {
      const { container } = setup();
      expect(container.querySelector("[commandfor]")).toBeNull();
      expect(container.querySelector("dialog")).toBeNull();
    });

    it('has one link, "Certificate", for a Skill with one', () => {
      setup([TESTDOME]);
      expect(screen.getByRole("button", { hidden: true, name: "Certificate" })).toHaveAttribute(
        "command",
        "show-modal",
      );
    });

    it("has a link per Certificate, each labelled by its issuer, for a Skill with two", () => {
      setup([TESTDOME, EDUCATIVE]);
      expect(screen.getByRole("button", { hidden: true, name: "TestDome" })).toBeInTheDocument();
      expect(screen.getByRole("button", { hidden: true, name: "Educative" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { hidden: true, name: "Certificate" })).toBeNull();
    });

    it("shows them only while the Skill is open: they sit in the overview, out of reach until then", () => {
      setup([TESTDOME]);
      const link = screen.getByRole("button", { hidden: true, name: "Certificate" });
      expect(link.closest("[inert]")).not.toBeNull();
      fireEvent.click(screen.getByRole("button", { name: "Overview of TypeScript" }));
      expect(link.closest("[inert]")).toBeNull();
    });
  });
});
