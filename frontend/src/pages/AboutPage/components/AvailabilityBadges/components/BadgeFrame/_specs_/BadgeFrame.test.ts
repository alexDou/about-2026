import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { createElement } from "octane";
import { BadgeFrame } from ".././BadgeFrame.tsrx";

const props = { text: "AVAILABLE NOW", title: "Can start immediately." };

describe("BadgeFrame", () => {
  it("is an image named by the badge's text", () => {
    render(BadgeFrame, { props });
    expect(screen.getByRole("img", { name: "AVAILABLE NOW" })).toBeInTheDocument();
  });

  it("carries the expressive title as the SVG title", () => {
    render(BadgeFrame, { props });
    expect(screen.getByTitle("Can start immediately.")).toBeInTheDocument();
  });

  it("draws its children inside the square viewBox", () => {
    render(BadgeFrame, {
      props: { ...props, children: createElement("circle", { "data-testid": "face" }) },
    });
    const svg = screen.getByRole("img");
    expect(svg).toHaveAttribute("viewBox", "0 0 120 120");
    expect(svg).toContainElement(screen.getByTestId("face"));
  });
});
