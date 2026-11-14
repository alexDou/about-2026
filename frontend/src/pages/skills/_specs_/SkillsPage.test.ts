import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { intlWrapper } from "../../../i18n";
import { SkillsPage } from "../SkillsPage.tsrx";

describe("SkillsPage", () => {
  it("shows only its heading, titled by the Panel's message", () => {
    const { container } = render(SkillsPage, { props: {}, wrapper: intlWrapper() });
    expect(screen.getByRole("heading", { level: 1, name: "Skills" })).toBeInTheDocument();
    expect(container).toHaveTextContent(/^Skills$/);
  });

  it("takes the heading from the messages", () => {
    render(SkillsPage, {
      props: {},
      wrapper: intlWrapper({ "board.panel.skills.title": "Titel" }),
    });
    expect(screen.getByRole("heading", { name: "Titel" })).toBeInTheDocument();
  });
});
