import { render, screen } from "@octanejs/testing-library";
import { beforeEach, describe, expect, it } from "vitest";
import { enMessages, intlWrapper } from "../../../../../../i18n";
import { PANEL_IDS, routerWrapper } from "../../../../../../hooks/useRoute";
import { SUBLABEL_BY_PANEL } from "../config";
import { Panel } from "../Panel.tsrx";

describe("Panel", () => {
  beforeEach(() => window.history.replaceState(null, "", "/explore"));

  it("is a list item with its title as a link to its URL", () => {
    render(Panel, {
      props: { panel: "skills", tone: "teal", entering: false },
      wrapper: routerWrapper(intlWrapper()),
    });
    expect(screen.getByRole("listitem")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute("href", "/skills");
  });

  it("switches its tone as a class", () => {
    render(Panel, {
      props: { panel: "skills", tone: "teal", entering: false },
      wrapper: routerWrapper(intlWrapper()),
    });
    expect(screen.getByRole("listitem")).toHaveClass("teal");
    expect(screen.getByRole("listitem")).not.toHaveClass("ink");
  });

  it.each([
    [true, "takes part in"],
    [false, "stays out of"],
  ])("entering=%s: it %s the Board's entrance", (entering) => {
    render(Panel, {
      props: { panel: "skills", tone: "teal", entering },
      wrapper: routerWrapper(intlWrapper()),
    });
    expect(screen.getByRole("listitem").classList.contains("entering")).toBe(entering);
  });

  it("shows a Sublabel where its message exists, outside the link", () => {
    render(Panel, {
      props: { panel: "whatIDo", tone: "mist", entering: false },
      wrapper: routerWrapper(intlWrapper()),
    });
    expect(screen.getByText("36 Takeovers")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAccessibleName("What I do");
    expect(screen.getByRole("link")).not.toContainElement(screen.getByText("36 Takeovers"));
  });

  it("shows no Sublabel where there is no message", () => {
    render(Panel, {
      props: { panel: "about", tone: "ink", entering: false },
      wrapper: routerWrapper(intlWrapper()),
    });
    expect(screen.getByRole("listitem")).toHaveTextContent(/^About$/);
  });

  it("takes the Sublabel from the messages", () => {
    render(Panel, {
      props: { panel: "chatWithMe", tone: "blue", entering: false },
      wrapper: routerWrapper(intlWrapper({ "board.panel.chatWithMe.sublabel": "KI-Agent" })),
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
