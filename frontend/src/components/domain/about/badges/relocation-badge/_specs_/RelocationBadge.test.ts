import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { RelocationBadge } from "../RelocationBadge.tsrx";

describe("RelocationBadge", () => {
  it("names and titles the badge from its props", () => {
    render(RelocationBadge, { props: { text: "UMZUG", title: "Überall hin." } });
    expect(screen.getByRole("img", { name: "UMZUG" })).toBeInTheDocument();
    expect(screen.getByTitle("Überall hin.")).toBeInTheDocument();
  });

  it("sets its text once, as SVG text on the cart", () => {
    render(RelocationBadge, { props: { text: "RELOCATION", title: "x" } });
    expect(screen.getByText("RELOCATION").tagName).toBe("text");
  });
});
