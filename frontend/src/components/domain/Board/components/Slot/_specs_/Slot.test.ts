import { render, screen } from "@octanejs/testing-library";
import { createElement } from "octane";
import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_BOARD } from "../../../../../../hooks/useRoute";
import { entering$, go, reset } from "../../../motion";
import { SLOT_VIEWS } from "../config";
import { Slot } from ".././Slot.tsrx";

const props = { tone: "teal", view: SLOT_VIEWS.panel } as const;

afterEach(reset);

const children = createElement("p", null, "The view");

describe("Slot", () => {
  it("is a list item that holds the view", () => {
    render(Slot, { props: { ...props, children } });
    expect(screen.getByRole("listitem")).toContainElement(screen.getByText("The view"));
  });

  it("switches its tone as a class", () => {
    render(Slot, { props: { ...props, children } });
    expect(screen.getByRole("listitem")).toHaveClass("slot--teal");
    expect(screen.getByRole("listitem")).not.toHaveClass("slot--ink");
  });

  it.each(Object.values(SLOT_VIEWS))("switches to the %s view as a class", (view) => {
    render(Slot, { props: { ...props, view, children } });
    expect(screen.getByRole("listitem")).toHaveClass(`slot--${view}`);
  });

  it("takes part in the Board's entrance while it plays", () => {
    go(DEFAULT_BOARD, false);
    expect(entering$.get()).toBe(true);
    render(Slot, { props: { ...props, children } });
    expect(screen.getByRole("listitem")).toHaveClass("slot--entering");
  });

  it("stays out of the entrance where it is over", () => {
    go(DEFAULT_BOARD, true);
    render(Slot, { props: { ...props, children } });
    expect(screen.getByRole("listitem")).not.toHaveClass("slot--entering");
  });

  it("does not unfold when it shows a Stripe or the Expanded panel, on a direct visit to a Panel", () => {
    render(Slot, { props: { ...props, view: SLOT_VIEWS.stripe, children } });
    expect(screen.getByRole("listitem")).not.toHaveClass("slot--entering");
  });
});
