import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { Icon } from "../Icon.tsrx";
import { ICON_SIZES, ICON_TONES } from "../config";
import type { IconProps } from "../types";

const renderIcon = (props: Partial<IconProps> = {}) =>
  render(Icon, { props: { media: "plane.svg", ...props } });

const drawing = (container: HTMLElement) => container.querySelector("svg") as SVGElement;

describe("Icon", () => {
  it("draws the icon's file through use, so the icon takes its colour from CSS", () => {
    const { container } = renderIcon();
    expect(drawing(container).querySelector("use")?.getAttribute("href")).toBe("plane.svg#icon");
  });

  it("is hidden from assistive technology unless it is given a label", () => {
    const { container } = renderIcon();
    expect(drawing(container).getAttribute("aria-hidden")).toBe("true");
    expect(drawing(container).getAttribute("role")).toBeNull();
  });

  it("is an image named by its label when it has one", () => {
    renderIcon({ label: "Send" });
    expect(screen.getByRole("img", { name: "Send" })).toBeInTheDocument();
  });

  it("wears the medium size and takes its colour from the text unless told otherwise", () => {
    const { container } = renderIcon();
    const { className } = drawing(container);
    expect(className.baseVal).toContain(`icon--${ICON_SIZES.medium}`);
    expect(className.baseVal).toContain(`icon--${ICON_TONES.inherit}`);
  });

  it.each(Object.values(ICON_SIZES))("wears the %s size when asked", (size) => {
    const { container } = renderIcon({ size });
    expect(drawing(container).className.baseVal).toContain(`icon--${size}`);
  });

  it.each(Object.values(ICON_TONES))("wears the %s tone when asked", (tone) => {
    const { container } = renderIcon({ tone });
    expect(drawing(container).className.baseVal).toContain(`icon--${tone}`);
  });
});
