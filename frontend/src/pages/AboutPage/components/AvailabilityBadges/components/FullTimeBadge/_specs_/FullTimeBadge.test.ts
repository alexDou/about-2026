import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { FullTimeBadge } from ".././FullTimeBadge.tsrx";

describe("FullTimeBadge", () => {
  it("names and titles the badge from its props", () => {
    render(FullTimeBadge, { props: { text: "VOLLZEIT", title: "Unbefristet." } });
    expect(screen.getByRole("img", { name: "VOLLZEIT" })).toBeInTheDocument();
    expect(screen.getByTitle("Unbefristet.")).toBeInTheDocument();
  });

  it("sets its text once, as SVG text on the ribbon", () => {
    render(FullTimeBadge, { props: { text: "FULL-TIME", title: "x" } });
    expect(screen.getByText("FULL-TIME").tagName).toBe("text");
  });
});
