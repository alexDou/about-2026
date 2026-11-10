import { fireEvent, render, screen } from "@octanejs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { enMessages, intlWrapper } from "../../../../../../i18n";
import { DEFAULT_BOARD, PANEL_IDS } from "../../../../../../hooks/useRoute";
import { entering$, go, reset } from "../../../motion";
import { SUBLABEL_BY_PANEL } from "../config";
import { Panel } from "../Panel.tsrx";

const noop = () => {};
const wrapper = intlWrapper();
const around = { mobile: false, reducedMotion: false };

afterEach(reset);

describe("Panel", () => {
  it("has its title as a link to its URL", () => {
    render(Panel, {
      props: { panel: "skills", href: "/skills", onClick: noop },
      wrapper,
    });
    expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute("href", "/skills");
  });

  it("hands the click on its title to its handler", () => {
    const onClick = vi.fn<(event: MouseEvent) => void>();
    render(Panel, {
      props: { panel: "skills", href: "/skills", onClick },
      wrapper,
    });
    fireEvent.click(screen.getByRole("link", { name: "Skills" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("takes part in the Board's entrance while it plays: its title fades in", () => {
    go(DEFAULT_BOARD, around);
    const { container } = render(Panel, {
      props: { panel: "skills", href: "/skills", onClick: noop },
      wrapper,
    });
    expect(container.querySelector(".panel")).toHaveClass("entering");
  });

  it("stays out of the entrance where it is over", () => {
    go(DEFAULT_BOARD, { ...around, reducedMotion: true });
    const { container } = render(Panel, {
      props: { panel: "skills", href: "/skills", onClick: noop },
      wrapper,
    });
    expect(container.querySelector(".panel")).not.toHaveClass("entering");
  });

  it("ends the Board's entrance when every title has faded in", () => {
    go(DEFAULT_BOARD, around);
    PANEL_IDS.forEach((panel) =>
      render(Panel, { props: { panel, href: `/${panel}`, onClick: noop }, wrapper }),
    );
    const contents = screen.getAllByRole("link").map((link) => link.parentElement as Element);

    // An animation inside a title is not the entrance's.
    contents.forEach((content) => fireEvent.animationEnd(content.firstElementChild as Element));
    expect(entering$.get()).toBe(true);

    contents.slice(0, -1).forEach((content) => fireEvent.animationEnd(content));
    expect(entering$.get()).toBe(true);
    fireEvent.animationEnd(contents.at(-1) as Element);
    expect(entering$.get()).toBe(false);
  });

  it("shows a Sublabel where its message exists, outside the link", () => {
    render(Panel, {
      props: { panel: "whatIDo", href: "/what-i-do", onClick: noop },
      wrapper,
    });
    expect(screen.getByText("36 Takeovers")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAccessibleName("What I do");
    expect(screen.getByRole("link")).not.toContainElement(screen.getByText("36 Takeovers"));
  });

  it("shows no Sublabel where there is no message", () => {
    const { container } = render(Panel, {
      props: { panel: "about", href: "/about", onClick: noop },
      wrapper,
    });
    expect(container.textContent).toBe("About");
  });

  it("takes the Sublabel from the messages", () => {
    render(Panel, {
      props: { panel: "chatWithMe", href: "/chat", onClick: noop },
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
