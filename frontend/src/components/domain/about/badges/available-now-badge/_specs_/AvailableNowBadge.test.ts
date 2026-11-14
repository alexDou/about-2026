import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { AvailableNowBadge } from "../AvailableNowBadge.tsrx";

describe("AvailableNowBadge", () => {
  it("names and titles the badge from its props", () => {
    render(AvailableNowBadge, { props: { text: "JETZT FREI", title: "Sofort startklar." } });
    expect(screen.getByRole("img", { name: "JETZT FREI" })).toBeInTheDocument();
    expect(screen.getByTitle("Sofort startklar.")).toBeInTheDocument();
  });

  it("sets its text on two lines, one word each", () => {
    render(AvailableNowBadge, { props: { text: "AVAILABLE NOW", title: "x" } });
    expect(screen.getByText("AVAILABLE").tagName).toBe("text");
    expect(screen.getByText("NOW").tagName).toBe("text");
  });
});
