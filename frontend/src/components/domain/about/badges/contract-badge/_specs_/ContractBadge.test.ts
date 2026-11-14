import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { ContractBadge } from "../ContractBadge.tsrx";

describe("ContractBadge", () => {
  it("names and titles the badge from its props", () => {
    render(ContractBadge, { props: { text: "VERTRAG", title: "Auf Projektbasis." } });
    expect(screen.getByRole("img", { name: "VERTRAG" })).toBeInTheDocument();
    expect(screen.getByTitle("Auf Projektbasis.")).toBeInTheDocument();
  });

  it("sets its text on the ring, on the top and on the bottom arc", () => {
    const { container } = render(ContractBadge, { props: { text: "CONTRACT", title: "x" } });
    const onRing = screen.getAllByText("CONTRACT");
    expect(onRing).toHaveLength(2);
    for (const run of onRing) {
      expect(run.tagName).toBe("textPath");
      const target = run.getAttribute("href")?.slice(1) ?? "";
      expect(container.querySelector(`[id="${target}"]`)).not.toBeNull();
    }
  });
});
