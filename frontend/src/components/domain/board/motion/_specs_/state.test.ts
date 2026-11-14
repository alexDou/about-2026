import { describe, expect, it } from "vitest";
import { DEFAULT_BOARD, PANEL_IDS, expandedBoard } from "../../../../../hooks/use-route";
import { initialState, isBusy, NOT_STARTED, routeChanged, scrollingUp, titleFaded } from "../state";

describe("initialState", () => {
  it("has the entrance to play on the default Board", () => {
    expect(initialState(DEFAULT_BOARD, false)).toEqual({
      started: true,
      scrolling: false,
      titles: PANEL_IDS,
    });
  });

  it("has no entrance on an Expanded panel, on a direct visit to a Panel", () => {
    expect(initialState(expandedBoard("skills"), false).titles).toEqual([]);
  });

  it("has no entrance with reduced motion", () => {
    expect(initialState(DEFAULT_BOARD, true).titles).toEqual([]);
  });
});

describe("a Board that has not started", () => {
  it("starts on the first route, whatever it is", () => {
    expect(routeChanged(NOT_STARTED, expandedBoard("skills"), false)).toEqual(
      initialState(expandedBoard("skills"), false),
    );
    expect(routeChanged(NOT_STARTED, DEFAULT_BOARD, false)).toEqual(
      initialState(DEFAULT_BOARD, false),
    );
  });

  it("skips the entrance with reduced motion", () => {
    expect(routeChanged(NOT_STARTED, DEFAULT_BOARD, true).titles).toEqual([]);
  });

  it("is busy: its entrance is still to play", () => {
    expect(isBusy(NOT_STARTED)).toBe(true);
  });
});

describe("routeChanged", () => {
  it("ends the entrance when the Board opens a Panel, so the Panels that come back do not replay it", () => {
    const opened = routeChanged(initialState(DEFAULT_BOARD, false), expandedBoard("skills"), false);
    expect(opened.titles).toEqual([]);
    expect(routeChanged(opened, DEFAULT_BOARD, false)).toBe(opened);
  });

  it("lets the entrance go on where the route stays on the default Board", () => {
    const state = initialState(DEFAULT_BOARD, false);
    expect(routeChanged(state, DEFAULT_BOARD, false)).toBe(state);
  });

  it("changes nothing between Expanded panels", () => {
    const state = initialState(expandedBoard("about"), false);
    expect(routeChanged(state, expandedBoard("contact"), false)).toBe(state);
  });
});

describe("scrollingUp", () => {
  it("is busy while the page scrolls up before a switch, and rests when it has", () => {
    const rested = initialState(expandedBoard("about"), false);
    expect(isBusy(rested)).toBe(false);
    const scrolling = scrollingUp(rested, true);
    expect(scrolling.scrolling).toBe(true);
    expect(isBusy(scrolling)).toBe(true);
    expect(isBusy(scrollingUp(scrolling, false))).toBe(false);
  });

  it("changes nothing where it already is", () => {
    const rested = initialState(expandedBoard("about"), false);
    expect(scrollingUp(rested, false)).toBe(rested);
  });
});

describe("titleFaded", () => {
  it("takes the Panel off the titles still to fade in", () => {
    expect(titleFaded(initialState(DEFAULT_BOARD, false), "skills").titles).toEqual(
      PANEL_IDS.filter((panel) => panel !== "skills"),
    );
  });

  it("changes nothing for a Panel that is not waited for", () => {
    const state = initialState(expandedBoard("skills"), false);
    expect(titleFaded(state, "skills")).toBe(state);
  });
});

describe("isBusy", () => {
  it("is busy during the entrance", () => {
    expect(isBusy(initialState(DEFAULT_BOARD, false))).toBe(true);
  });

  it("is not busy at rest", () => {
    expect(isBusy(initialState(DEFAULT_BOARD, true))).toBe(false);
    expect(isBusy(initialState(expandedBoard("skills"), false))).toBe(false);
  });
});
