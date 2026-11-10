import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { Sublabel } from "../Sublabel.tsrx";

describe("Sublabel", () => {
  it("shows its text", () => {
    render(Sublabel, { props: { text: "36 Takeovers" } });
    expect(screen.getByText("36 Takeovers")).toBeInTheDocument();
  });

  it("is plain text, not a link", () => {
    render(Sublabel, { props: { text: "36 Takeovers" } });
    expect(screen.queryByRole("link")).toBeNull();
  });
});
