import { render, screen } from "@octanejs/testing-library";
import { createElement } from "octane";
import { describe, expect, it } from "vitest";
import { Slot } from ".././Slot.tsrx";

const props = { tone: "teal", view: "panel", shown: true, entering: false } as const;
const children = createElement("p", null, "The view");

describe("Slot", () => {
  it("is a list item that holds the view", () => {
    render(Slot, { props: { ...props, children } });
    expect(screen.getByRole("listitem")).toContainElement(screen.getByText("The view"));
  });

  it("switches its tone as a class", () => {
    render(Slot, { props: { ...props, children } });
    expect(screen.getByRole("listitem")).toHaveClass("teal");
    expect(screen.getByRole("listitem")).not.toHaveClass("ink");
  });

  it.each(["panel", "stripe", "expanded"] as const)(
    "switches to the %s view as a class",
    (view) => {
      render(Slot, { props: { ...props, view, children } });
      expect(screen.getByRole("listitem")).toHaveClass(view);
    },
  );

  it.each([
    [true, "takes part in"],
    [false, "stays out of"],
  ])("entering=%s: it %s the Board's entrance", (entering) => {
    render(Slot, { props: { ...props, entering, children } });
    expect(screen.getByRole("listitem").classList.contains("entering")).toBe(entering);
  });

  it("shows the view, within reach", () => {
    render(Slot, { props: { ...props, children } });
    const view = screen.getByText("The view").parentElement;
    expect(view).not.toHaveClass("hidden");
    expect(view).not.toHaveAttribute("inert");
  });

  it("fades the view out and puts it out of reach while it is not shown", () => {
    render(Slot, { props: { ...props, shown: false, children } });
    const view = screen.getByText("The view").parentElement;
    expect(view).toHaveClass("hidden");
    expect(view).toHaveAttribute("inert");
  });

  it("marks the slot and its view as the elements whose transitions a stage waits for", () => {
    render(Slot, { props: { ...props, children } });
    expect(screen.getByRole("listitem")).toHaveAttribute("data-seq");
    expect(screen.getByText("The view").parentElement).toHaveAttribute("data-seq");
  });
});
