import { render, screen } from "@octanejs/testing-library";
import { beforeEach, describe, expect, it } from "vitest";
import { enMessages, intlWrapper } from "../../../../../../i18n";
import { PANEL_IDS } from "../../../../../../hooks/useRoute";
import { SUBLABEL_BY_PANEL } from "../config";
import { Panel } from "../Panel.tsrx";

describe("Panel", () => {
  beforeEach(() => window.history.replaceState(null, "", "/explore"));

  it("is a list item with its title as a link to its URL", () => {
    render(Panel, { props: { panel: "skills", tone: "teal" }, wrapper: intlWrapper() });
    expect(screen.getByRole("listitem")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute("href", "/skills");
  });

  it("switches its tone as a class", () => {
    render(Panel, { props: { panel: "skills", tone: "teal" }, wrapper: intlWrapper() });
    expect(screen.getByRole("listitem")).toHaveClass("teal");
    expect(screen.getByRole("listitem")).not.toHaveClass("ink");
  });

  it("shows a Sublabel where its message exists, outside the link", () => {
    render(Panel, { props: { panel: "whatIDo", tone: "mist" }, wrapper: intlWrapper() });
    expect(screen.getByText("36 Takeovers")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAccessibleName("What I do");
    expect(screen.getByRole("link")).not.toContainElement(screen.getByText("36 Takeovers"));
  });

  it("shows no Sublabel where there is no message", () => {
    render(Panel, { props: { panel: "about", tone: "ink" }, wrapper: intlWrapper() });
    expect(screen.getByRole("listitem")).toHaveTextContent(/^About$/);
  });

  it("takes the Sublabel from the messages", () => {
    render(Panel, {
      props: { panel: "chatWithMe", tone: "blue" },
      wrapper: intlWrapper({ "board.panel.chatWithMe.sublabel": "KI-Agent" }),
    });
    expect(screen.getByText("KI-Agent")).toBeInTheDocument();
  });
});

describe("Sublabel messages", () => {
  it("exist exactly for the Panels that list one", () => {
    const withMessage = PANEL_IDS.filter((panel) => `board.panel.${panel}.sublabel` in enMessages);
    expect(withMessage).toEqual(
      PANEL_IDS.filter((panel) => SUBLABEL_BY_PANEL[panel] !== undefined),
    );
  });
});
