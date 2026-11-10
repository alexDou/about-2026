import { fireEvent, render, screen } from "@octanejs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { Stripe } from ".././Stripe.tsrx";

describe("Stripe", () => {
  const props = { tone: "teal", title: "Skills", href: "/skills" } as const;

  it("is a list item whose whole body is a link to the Panel's URL", () => {
    render(Stripe, { props: { ...props, onClick: () => {} } });
    expect(screen.getByRole("listitem")).toContainElement(
      screen.getByRole("link", { name: "Skills" }),
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/skills");
    expect(screen.getByRole("listitem")).toHaveTextContent(/^Skills$/);
  });

  it("switches its tone as a class", () => {
    render(Stripe, { props: { ...props, onClick: () => {} } });
    expect(screen.getByRole("listitem")).toHaveClass("teal");
  });

  it("hands the click to its handler", () => {
    const onClick = vi.fn<(event: MouseEvent) => void>();
    render(Stripe, { props: { ...props, onClick } });
    fireEvent.click(screen.getByRole("link"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
