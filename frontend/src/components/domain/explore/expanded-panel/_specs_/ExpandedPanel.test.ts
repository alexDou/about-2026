import { fireEvent, render, screen } from "@octanejs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { createElement } from "octane";
import { ExpandedPanel } from "../ExpandedPanel.tsrx";

const props = { closeLabel: "Close Skills" } as const;

describe("ExpandedPanel", () => {
  it("shows the page", () => {
    render(ExpandedPanel, {
      props: { ...props, onClose: () => {}, children: createElement("p", null, "The page") },
    });
    expect(screen.getByText("The page")).toBeInTheDocument();
  });

  it("has a close button titled by its label, before the page in the tab order", () => {
    render(ExpandedPanel, {
      props: { ...props, onClose: () => {}, children: createElement("a", { href: "#" }, "A link") },
    });
    const button = screen.getByRole("button", { name: "Close Skills" });
    expect(button).toHaveAttribute("title", "Close Skills");
    const link = screen.getByRole("link", { name: "A link" });
    expect(button.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
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
    const { container } = render(ExpandedPanel, { props: { ...props, onClose } });
    fireEvent.click(container.querySelector(".expanded-panel")!);
    expect(onClose).not.toHaveBeenCalled();
  });
});
