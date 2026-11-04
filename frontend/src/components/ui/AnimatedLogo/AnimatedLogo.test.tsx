import { fireEvent, render, screen } from "@octanejs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { AnimatedLogo } from "./AnimatedLogo";
import { WEAVE_SETTINGS } from "./config";

describe("AnimatedLogo", () => {
  it("renders one drawn path per weave line", () => {
    const { container } = render(AnimatedLogo, { props: {} });
    const ring = container.querySelectorAll('[data-part="ring"] path');
    const line = container.querySelectorAll('[data-part="line"] path');
    expect(ring).toHaveLength(WEAVE_SETTINGS.ring.weave);
    expect(line).toHaveLength(WEAVE_SETTINGS.line.weave);
    expect(ring[0]?.getAttribute("d")).toMatch(/^M/);
  });

  it("is a labelled button that calls onClick", () => {
    const onClick = vi.fn<(event: MouseEvent) => void>();
    render(AnimatedLogo, { props: { label: "Home", onClick } });
    fireEvent.click(screen.getByRole("button", { name: "Home" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
