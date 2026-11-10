import { fireEvent, render, screen } from "@octanejs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { Stripe } from ".././Stripe.tsrx";

describe("Stripe", () => {
  const props = { title: "Skills", href: "/skills" } as const;

  it("is one link to the Panel's URL that is the whole Stripe", () => {
    const { container } = render(Stripe, { props: { ...props, onClick: () => {} } });
    expect(screen.getByRole("link", { name: "Skills" })).toHaveAttribute("href", "/skills");
    expect(container.textContent).toBe("Skills");
  });

  it("hands the click to its handler", () => {
    const onClick = vi.fn<(event: MouseEvent) => void>();
    render(Stripe, { props: { ...props, onClick } });
    fireEvent.click(screen.getByRole("link"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
