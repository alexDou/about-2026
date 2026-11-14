import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { intlWrapper } from "../../../i18n";
import { AboutPage } from "../AboutPage.tsrx";

describe("AboutPage", () => {
  it("shows its heading, titled by the Panel's message", () => {
    render(AboutPage, { props: {}, wrapper: intlWrapper() });
    expect(screen.getByRole("heading", { level: 1, name: "About" })).toBeInTheDocument();
  });

  it("shows the six availability badges", () => {
    render(AboutPage, { props: {}, wrapper: intlWrapper() });
    expect(screen.getAllByRole("img")).toHaveLength(6);
  });

  it("takes the heading from the messages", () => {
    render(AboutPage, {
      props: {},
      wrapper: intlWrapper({ "board.panel.about.title": "Titel" }),
    });
    expect(screen.getByRole("heading", { name: "Titel" })).toBeInTheDocument();
  });
});
