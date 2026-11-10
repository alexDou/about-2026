import { fireEvent, render, screen } from "@octanejs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { enMessages, intlWrapper } from "../../../../../../i18n";
import { PANEL_IDS } from "../../../../../../hooks/useRoute";
import { SUBLABEL_BY_PANEL } from "../config";
import { Panel } from "../Panel.tsrx";

const noop = () => {};

describe("Panel", () => {
  it("has its title as a link to its URL", () => {
    render(Panel, {
      props: { panel: "skills", href: "/skills", onClick: noop, entering: false },
      wrapper: intlWrapper(),
    });
    expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute("href", "/skills");
  });

  it("hands the click on its title to its handler", () => {
    const onClick = vi.fn<(event: MouseEvent) => void>();
    render(Panel, {
      props: { panel: "skills", href: "/skills", onClick, entering: false },
      wrapper: intlWrapper(),
    });
    fireEvent.click(screen.getByRole("link", { name: "Skills" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.each([
    [true, "takes part in"],
    [false, "stays out of"],
  ])("entering=%s: its title %s the Board's entrance", (entering) => {
    const { container } = render(Panel, {
      props: { panel: "skills", href: "/skills", onClick: noop, entering },
      wrapper: intlWrapper(),
    });
    expect(container.querySelector(".panel")?.classList.contains("entering")).toBe(entering);
  });

  it("shows a Sublabel where its message exists, outside the link", () => {
    render(Panel, {
      props: { panel: "whatIDo", href: "/what-i-do", onClick: noop, entering: false },
      wrapper: intlWrapper(),
    });
    expect(screen.getByText("36 Takeovers")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAccessibleName("What I do");
    expect(screen.getByRole("link")).not.toContainElement(screen.getByText("36 Takeovers"));
  });

  it("shows no Sublabel where there is no message", () => {
    const { container } = render(Panel, {
      props: { panel: "about", href: "/about", onClick: noop, entering: false },
      wrapper: intlWrapper(),
    });
    expect(container.textContent).toBe("About");
  });

  it("takes the Sublabel from the messages", () => {
    render(Panel, {
      props: { panel: "chatWithMe", href: "/chat", onClick: noop, entering: false },
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
