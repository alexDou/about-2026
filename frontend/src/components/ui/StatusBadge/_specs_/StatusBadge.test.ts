import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { StatusBadge } from ".././StatusBadge.tsrx";

describe("StatusBadge", () => {
  it("renders the label with its tone", () => {
    render(StatusBadge, { props: { label: "API: ok", tone: "ok" } });
    const badge = screen.getByText("API: ok");
    expect(badge).toHaveAttribute("data-tone", "ok");
    expect(badge).toHaveClass("status-badge", "status-badge--ok");
  });
});
