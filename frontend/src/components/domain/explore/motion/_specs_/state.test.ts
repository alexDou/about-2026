import { describe, expect, it } from "vitest";
import { DEFAULT_EXPLORE, PANEL_IDS, expandedExplore } from "../../../../../hooks/use-route";
import { initialState, isBusy, NOT_STARTED, routeChanged, scrollingUp, titleFaded } from "../state";

describe("initialState", () => {
  it("has the entrance to play on the default Explore", () => {
    expect(initialState(DEFAULT_EXPLORE, false)).toEqual({
      started: true,
      scrolling: false,
      titles: PANEL_IDS,
    });
  });

  it("has no entrance on an Expanded panel, on a direct visit to a Panel", () => {
    expect(initialState(expandedExplore("skills"), false).titles).toEqual([]);
  });

  it("has no entrance with reduced motion", () => {
    expect(initialState(DEFAULT_EXPLORE, true).titles).toEqual([]);
  });
});

describe("an Explore that has not started", () => {
  it("starts on the first route, whatever it is", () => {
    expect(routeChanged(NOT_STARTED, expandedExplore("skills"), false)).toEqual(
      initialState(expandedExplore("skills"), false),
    );
    expect(routeChanged(NOT_STARTED, DEFAULT_EXPLORE, false)).toEqual(
      initialState(DEFAULT_EXPLORE, false),
    );
  });

  it("skips the entrance with reduced motion", () => {
    expect(routeChanged(NOT_STARTED, DEFAULT_EXPLORE, true).titles).toEqual([]);
  });

  it("is busy: its entrance is still to play", () => {
    expect(isBusy(NOT_STARTED)).toBe(true);
  });
});

describe("routeChanged", () => {
  it("ends the entrance when Explore opens a Panel, so the Panels that come back do not replay it", () => {
    const opened = routeChanged(
      initialState(DEFAULT_EXPLORE, false),
      expandedExplore("skills"),
      false,
    );
    expect(opened.titles).toEqual([]);
    expect(routeChanged(opened, DEFAULT_EXPLORE, false)).toBe(opened);
  });

  it("lets the entrance go on where the route stays on the default Explore", () => {
    const state = initialState(DEFAULT_EXPLORE, false);
    expect(routeChanged(state, DEFAULT_EXPLORE, false)).toBe(state);
  });

  it("changes nothing between Expanded panels", () => {
    const state = initialState(expandedExplore("about"), false);
    expect(routeChanged(state, expandedExplore("contact"), false)).toBe(state);
  });
});

describe("scrollingUp", () => {
  it("is busy while the page scrolls up before a switch, and rests when it has", () => {
    const rested = initialState(expandedExplore("about"), false);
    expect(isBusy(rested)).toBe(false);
    const scrolling = scrollingUp(rested, true);
    expect(scrolling.scrolling).toBe(true);
    expect(isBusy(scrolling)).toBe(true);
    expect(isBusy(scrollingUp(scrolling, false))).toBe(false);
  });

  it("changes nothing where it already is", () => {
    const rested = initialState(expandedExplore("about"), false);
    expect(scrollingUp(rested, false)).toBe(rested);
  });
});

describe("titleFaded", () => {
  it("takes the Panel off the titles still to fade in", () => {
    expect(titleFaded(initialState(DEFAULT_EXPLORE, false), "skills").titles).toEqual(
      PANEL_IDS.filter((panel) => panel !== "skills"),
    );
  });

  it("changes nothing for a Panel that is not waited for", () => {
    const state = initialState(expandedExplore("skills"), false);
    expect(titleFaded(state, "skills")).toBe(state);
  });
});

describe("isBusy", () => {
  it("is busy during the entrance", () => {
    expect(isBusy(initialState(DEFAULT_EXPLORE, false))).toBe(true);
  });

  it("is not busy at rest", () => {
    expect(isBusy(initialState(DEFAULT_EXPLORE, true))).toBe(false);
    expect(isBusy(initialState(expandedExplore("skills"), false))).toBe(false);
  });
});
