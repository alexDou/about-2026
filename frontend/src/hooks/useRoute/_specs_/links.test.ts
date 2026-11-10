import { describe, expect, it } from "vitest";
import { isPlainClick } from "../links";

const click = (init: MouseEventInit = {}) => new MouseEvent("click", { button: 0, ...init });

describe("isPlainClick", () => {
  it("accepts a primary click without modifiers", () => {
    expect(isPlainClick(click())).toBe(true);
  });

  it.each([
    ["Ctrl", { ctrlKey: true }],
    ["Meta", { metaKey: true }],
    ["Shift", { shiftKey: true }],
    ["Alt", { altKey: true }],
    ["middle button", { button: 1 }],
    ["right button", { button: 2 }],
  ])("leaves a %s click to the browser", (_name, init) => {
    expect(isPlainClick(click(init))).toBe(false);
  });

  it("leaves a click someone already handled to them", () => {
    const event = click({ cancelable: true });
    event.preventDefault();
    expect(isPlainClick(event)).toBe(false);
  });
});
