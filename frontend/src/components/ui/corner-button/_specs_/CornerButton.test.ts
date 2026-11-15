import { fireEvent, render, screen } from "@octanejs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { CornerButton } from "../CornerButton.tsrx";

describe("CornerButton", () => {
  it("is a button named and titled by its label", () => {
    render(CornerButton, { props: { label: "Close Skills", onClick: () => {} } });
    const button = screen.getByRole("button", { name: "Close Skills" });
    expect(button).toHaveAttribute("title", "Close Skills");
    expect(button).toHaveAttribute("type", "button");
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn<() => void>();
    render(CornerButton, { props: { label: "Close Skills", onClick } });
    fireEvent.click(screen.getByRole("button", { name: "Close Skills" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
