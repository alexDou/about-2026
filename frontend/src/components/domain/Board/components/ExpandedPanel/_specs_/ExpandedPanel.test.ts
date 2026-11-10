import { fireEvent, render, screen } from "@octanejs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { createElement } from "octane";
import { ExpandedPanel } from ".././ExpandedPanel.tsrx";

const props = { tone: "teal", closeLabel: "Close Skills" } as const;

describe("ExpandedPanel", () => {
  it("is a list item in its tone that shows the page", () => {
    render(ExpandedPanel, {
      props: { ...props, onClose: () => {}, children: createElement("p", null, "The page") },
    });
    expect(screen.getByRole("listitem")).toHaveClass("teal");
    expect(screen.getByRole("listitem")).toContainElement(screen.getByText("The page"));
  });

  it("has a close button titled by its label, with its icon hidden from screen readers", () => {
    render(ExpandedPanel, { props: { ...props, onClose: () => {} } });
    const button = screen.getByRole("button", { name: "Close Skills" });
    expect(button).toHaveAttribute("title", "Close Skills");
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("closes on the close button", () => {
    const onClose = vi.fn<() => void>();
    render(ExpandedPanel, { props: { ...props, onClose } });
    fireEvent.click(screen.getByRole("button", { name: "Close Skills" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape", () => {
    const onClose = vi.fn<() => void>();
    render(ExpandedPanel, { props: { ...props, onClose } });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ignores other keys", () => {
    const onClose = vi.fn<() => void>();
    render(ExpandedPanel, { props: { ...props, onClose } });
    fireEvent.keyDown(document, { key: "Enter" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("stops listening for Escape once it is gone", () => {
    const onClose = vi.fn<() => void>();
    const { unmount } = render(ExpandedPanel, { props: { ...props, onClose } });
    unmount();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does nothing when the panel itself is clicked", () => {
    const onClose = vi.fn<() => void>();
    render(ExpandedPanel, { props: { ...props, onClose } });
    fireEvent.click(screen.getByRole("listitem"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
