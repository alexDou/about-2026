import { fireEvent, render, screen } from "@octanejs/testing-library";
import { createElement } from "octane";
import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_BOARD, PANEL_IDS, expandedBoard } from "../../../../../../hooks/useRoute";
import { STAGE_VIEWS } from "../../../config";
import { busy$, entering$, go, reset, stage$ } from "../../../motion";
import type { Surroundings } from "../../../motion";
import { FADE_PROPERTY, RESIZE_PROPERTY, SLOT_VIEWS } from "../config";
import { Slot } from ".././Slot.tsrx";

const props = { panel: "skills", tone: "teal", view: SLOT_VIEWS.panel, shown: true } as const;
const around: Surroundings = { mobile: false, reducedMotion: false };

/** The Board's motion at rest on `board`, its entrance over (reduced motion) unless asked for. */
const startAt = (
  board: Parameters<typeof go>[0],
  extra: Partial<Surroundings> = { reducedMotion: true },
) => go(board, { ...around, ...extra });

afterEach(reset);

const busyNow = () => busy$.get();
const children = createElement("p", null, "The view");

/** The browser ends the transition of `propertyName` on `target`. */
const transitionEnd = (target: Element, propertyName: string) => {
  const event = new Event("transitionend", { bubbles: true });
  Object.defineProperty(event, "propertyName", { value: propertyName });
  fireEvent(target, event);
};

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

  it.each(Object.values(SLOT_VIEWS))("switches to the %s view as a class", (view) => {
    render(Slot, { props: { ...props, view, children } });
    expect(screen.getByRole("listitem")).toHaveClass(view);
  });

  it("takes part in the Board's entrance while it plays", () => {
    startAt(DEFAULT_BOARD, { reducedMotion: false });
    expect(entering$.get()).toBe(true);
    render(Slot, { props: { ...props, children } });
    expect(screen.getByRole("listitem")).toHaveClass("entering");
  });

  it("stays out of the entrance where it is over", () => {
    startAt(DEFAULT_BOARD);
    render(Slot, { props: { ...props, children } });
    expect(screen.getByRole("listitem")).not.toHaveClass("entering");
  });

  it("does not unfold when it shows a Stripe or the Expanded panel, on a direct visit to a Panel", () => {
    render(Slot, { props: { ...props, view: SLOT_VIEWS.stripe, children } });
    expect(screen.getByRole("listitem")).not.toHaveClass("entering");
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

  describe("tells the Board's motion what a stage waits for", () => {
    it("says its slot resized when the slot's size transition ends, once every slot has", () => {
      startAt(expandedBoard("about"));
      // Switching from About to Contact resizes those two slots and fades no view.
      go(expandedBoard("contact"), around);
      expect(stage$.get()).toEqual({ layout: "contact", views: STAGE_VIEWS.expanded });

      render(Slot, { props: { ...props, panel: "about", children } });
      render(Slot, { props: { ...props, panel: "contact", children } });
      const [about, contact] = screen.getAllByRole("listitem") as [HTMLElement, HTMLElement];

      transitionEnd(about, RESIZE_PROPERTY);
      transitionEnd(about, RESIZE_PROPERTY);
      expect(busyNow()).toBe(true);
      transitionEnd(contact, RESIZE_PROPERTY);
      expect(busyNow()).toBe(false);
    });

    it("says its view faded when the view's opacity transition ends, once every view has", () => {
      startAt(DEFAULT_BOARD);
      go(expandedBoard("skills"), around);
      // The Panels fade out first, then the slots resize.
      expect(stage$.get()).toEqual({ layout: null, views: STAGE_VIEWS.none });

      PANEL_IDS.forEach((panel) => render(Slot, { props: { ...props, panel, children } }));
      const views = screen.getAllByText("The view").map((view) => view.parentElement as Element);
      views.slice(0, -1).forEach((view) => transitionEnd(view, FADE_PROPERTY));
      expect(stage$.get()?.layout).toBeNull();
      transitionEnd(views.at(-1) as Element, FADE_PROPERTY);
      expect(stage$.get()).toEqual({ layout: "skills", views: STAGE_VIEWS.none });
    });

    it("ignores other properties, and transitions that ended inside the view", () => {
      startAt(DEFAULT_BOARD);
      go(expandedBoard("skills"), around);
      PANEL_IDS.forEach((panel) => render(Slot, { props: { ...props, panel, children } }));

      screen.getAllByRole("listitem").forEach((slot) => transitionEnd(slot, "background-color"));
      screen.getAllByText("The view").forEach((view) => {
        transitionEnd(view.parentElement as Element, RESIZE_PROPERTY);
        transitionEnd(view, FADE_PROPERTY);
      });
      expect(stage$.get()).toEqual({ layout: null, views: STAGE_VIEWS.none });
    });
  });
});
