import { fireEvent, render, screen } from "@octanejs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { WalkingToggle } from "../WalkingToggle.tsrx";

const LABEL = "Expand all";

function setup() {
  const onChange = vi.fn<(on: boolean) => void>();
  const { container } = render(WalkingToggle, { props: { label: LABEL, onChange } });
  const toggle = screen.getByRole("switch", { name: LABEL });
  const handle = container.querySelector("svg")!;
  return { onChange, toggle, handle, container };
}

describe("WalkingToggle", () => {
  it("is a button with the switch role, named by its label and off", () => {
    const { toggle } = setup();
    expect(toggle.tagName).toBe("BUTTON");
    expect(toggle).toHaveAttribute("type", "button");
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("shows no label text of its own: the label is its hint, shown by CSS on hover or focus", () => {
    const { toggle, container } = setup();
    const hint = container.querySelector("[aria-hidden='true']:not(svg)")!;
    expect(hint).toHaveTextContent(LABEL);
    // Plain markup: no popover API, no invoker attribute, so every browser shows it.
    expect(hint).not.toHaveAttribute("popover");
    expect(toggle).not.toHaveAttribute("interestfor");
    // The hint follows the switch, so the switch's :hover and :focus-visible reach it (`~`).
    expect(toggle.compareDocumentPosition(hint) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("walks only after the first change: no walk on load", () => {
    const { toggle, handle } = setup();
    const before = handle.getAttribute("class");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(handle.getAttribute("class")).not.toBe(before);
    expect(handle.getAttribute("class")).toMatch(/walking-toggle__handle--walking/);
    expect(before).not.toMatch(/walking-toggle__handle--walking/);
  });

  it("flips back and forth on each click", () => {
    const { toggle } = setup();
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("reports the new position only once the walk has ended", () => {
    const { toggle, handle, onChange } = setup();
    fireEvent.click(toggle);
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.animationEnd(handle);
    expect(onChange).toHaveBeenLastCalledWith(true);
    fireEvent.click(toggle);
    fireEvent.animationEnd(handle);
    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("ignores the legs' and feet's own animations ending", () => {
    const { toggle, handle, onChange } = setup();
    fireEvent.click(toggle);
    fireEvent.animationEnd(handle.querySelector("g g")!);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("reports once the slide has ended, under reduced motion (a transition, no walk)", () => {
    const { toggle, handle, onChange } = setup();
    fireEvent.click(toggle);
    fireEvent.transitionEnd(handle);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("reports nothing when no change was made", () => {
    const { handle, onChange } = setup();
    fireEvent.animationEnd(handle);
    fireEvent.transitionEnd(handle);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("draws a head and legs, without a face", () => {
    const { handle } = setup();
    expect(handle).toHaveAttribute("aria-hidden", "true");
    expect(handle.querySelectorAll("circle").length).toBeGreaterThan(0);
    expect(handle.querySelectorAll("polyline").length).toBe(6);
    expect(handle.querySelector("path")).toBeNull();
  });
});
