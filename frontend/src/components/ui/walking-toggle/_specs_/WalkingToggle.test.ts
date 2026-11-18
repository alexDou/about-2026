import { fireEvent, render, screen } from "@octanejs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { WalkingToggle } from "../WalkingToggle.tsrx";

/** What a click does in each position; the page passes them from its messages. */
const LABELS = { off: "Expand all", on: "Collapse all" };

function setup() {
  const onChange = vi.fn<(on: boolean) => void>();
  const { container } = render(WalkingToggle, { props: { labels: LABELS, onChange } });
  const toggle = screen.getByRole("button", { name: LABELS.off });
  const handle = container.querySelector("svg")!;
  return { onChange, toggle, handle, container };
}

describe("WalkingToggle", () => {
  it("is a button named by what a click does: off, it says the off label", () => {
    const { toggle } = setup();
    expect(toggle).toHaveAttribute("type", "button");
    // A name that says the action and an on/off state would contradict ("Collapse all, on").
    expect(toggle).not.toHaveAttribute("role");
    expect(toggle).not.toHaveAttribute("aria-checked");
  });

  it("takes the on label once clicked, and the off label again on the next click", () => {
    const { toggle, container } = setup();
    const hint = container.querySelector("span[aria-hidden='true']")!;
    expect(hint).toHaveTextContent(LABELS.off);
    fireEvent.click(toggle);
    expect(toggle).toHaveAccessibleName(LABELS.on);
    expect(hint).toHaveTextContent(LABELS.on);
    fireEvent.click(toggle);
    expect(toggle).toHaveAccessibleName(LABELS.off);
    expect(hint).toHaveTextContent(LABELS.off);
  });

  it("shows no label text of its own: the label is its hint, shown by CSS on hover or focus", () => {
    const { toggle, container } = setup();
    const hint = container.querySelector("span[aria-hidden='true']")!;
    expect(hint).toHaveTextContent(LABELS.off);
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
    expect(handle.getAttribute("class")).not.toBe(before);
    expect(handle.getAttribute("class")).toMatch(/walking-toggle__handle--walking/);
    expect(before).not.toMatch(/walking-toggle__handle--walking/);
  });

  it("marks the track as on, for its colour and the handle's place", () => {
    const { toggle } = setup();
    expect(toggle.getAttribute("class")).not.toMatch(/walking-toggle__track--on/);
    fireEvent.click(toggle);
    expect(toggle.getAttribute("class")).toMatch(/walking-toggle__track--on/);
    fireEvent.click(toggle);
    expect(toggle.getAttribute("class")).not.toMatch(/walking-toggle__track--on/);
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
