import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { AiReadyBadge } from ".././AiReadyBadge.tsrx";

describe("AiReadyBadge", () => {
  it("names and titles the badge from its props", () => {
    render(AiReadyBadge, { props: { text: "KI BEREIT", title: "Arbeitet mit KI." } });
    expect(screen.getByRole("img", { name: "KI BEREIT" })).toBeInTheDocument();
    expect(screen.getByTitle("Arbeitet mit KI.")).toBeInTheDocument();
  });

  it("sets its first word and the rest side by side as SVG text", () => {
    render(AiReadyBadge, { props: { text: "AI READY", title: "x" } });
    expect(screen.getByText("AI").tagName).toBe("text");
    expect(screen.getByText("READY").tagName).toBe("text");
  });
});
