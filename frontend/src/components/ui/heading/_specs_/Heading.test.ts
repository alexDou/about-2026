import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { Heading } from "../Heading.tsrx";

describe("Heading", () => {
  it("is the level-one heading of the page, with the given text", () => {
    render(Heading, { props: { text: "Skills" } });
    expect(screen.getByRole("heading", { level: 1, name: "Skills" })).toBeInTheDocument();
  });

  it("can take focus from code but is not a tab stop", () => {
    render(Heading, { props: { text: "Skills" } });
    const heading = screen.getByRole("heading");
    expect(heading).toHaveAttribute("tabindex", "-1");
    heading.focus();
    expect(heading).toHaveFocus();
  });
});
