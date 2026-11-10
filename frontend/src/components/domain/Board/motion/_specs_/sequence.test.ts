import { describe, expect, it } from "vitest";
import { DEFAULT_BOARD, PANEL_IDS, expandedBoard } from "../../../../../hooks/useRoute";
import type { BoardState, PanelId } from "../../../../../hooks/useRoute";
import { STAGE_VIEWS } from "../../config";
import type { BoardStage } from "../../types";
import {
  awaitedBy,
  initialState,
  isBusy,
  NOT_STARTED,
  planStages,
  routeChanged,
  scrollingUp,
  settledStage,
  titleFaded,
  transitionEnded,
} from "../sequence";
import type { BoardMotionState, Surroundings } from "../types";

const DEFAULT: BoardStage = { layout: null, views: STAGE_VIEWS.panels };
const EVEN: BoardStage = { layout: null, views: STAGE_VIEWS.none };
const resized = (panel: PanelId): BoardStage => ({ layout: panel, views: STAGE_VIEWS.none });
const EXPANDED = (panel: PanelId): BoardStage => ({ layout: panel, views: STAGE_VIEWS.expanded });

describe("settledStage", () => {
  it("shows the Panels for the default Board and the Stripes around the Expanded panel", () => {
    expect(settledStage(DEFAULT_BOARD)).toEqual(DEFAULT);
    expect(settledStage(expandedBoard("skills"))).toEqual(EXPANDED("skills"));
  });
});

describe("planStages on desktop", () => {
  it("opens: the Panels fade out, the widths change, the Stripes and the page fade in", () => {
    expect(planStages(DEFAULT, EXPANDED("skills"), false)).toEqual([
      EVEN,
      resized("skills"),
      EXPANDED("skills"),
    ]);
  });

  it("closes: the same steps backwards", () => {
    expect(planStages(EXPANDED("skills"), DEFAULT, false)).toEqual([
      resized("skills"),
      EVEN,
      DEFAULT,
    ]);
  });

  it("switches in one step: the views stay, only the widths animate", () => {
    expect(planStages(EXPANDED("about"), EXPANDED("contact"), false)).toEqual([
      EXPANDED("contact"),
    ]);
  });

  it("plays nothing where the Board already is", () => {
    expect(planStages(DEFAULT, DEFAULT, false)).toEqual([]);
    expect(planStages(EXPANDED("skills"), EXPANDED("skills"), false)).toEqual([]);
  });

  it("goes on from the middle of a sequence", () => {
    expect(planStages(resized("skills"), DEFAULT, false)).toEqual([EVEN, DEFAULT]);
    expect(planStages(EVEN, EXPANDED("about"), false)).toEqual([
      resized("about"),
      EXPANDED("about"),
    ]);
    expect(planStages(resized("about"), EXPANDED("contact"), false)).toEqual([
      EVEN,
      resized("contact"),
      EXPANDED("contact"),
    ]);
  });
});

describe("planStages on mobile", () => {
  it("opens, closes and switches in one step: no fade out, no closing step", () => {
    expect(planStages(DEFAULT, EXPANDED("skills"), true)).toEqual([EXPANDED("skills")]);
    expect(planStages(EXPANDED("skills"), DEFAULT, true)).toEqual([DEFAULT]);
    expect(planStages(EXPANDED("about"), EXPANDED("contact"), true)).toEqual([EXPANDED("contact")]);
  });

  it("plays nothing where the Board already is", () => {
    expect(planStages(EXPANDED("skills"), EXPANDED("skills"), true)).toEqual([]);
  });
});

describe("awaitedBy", () => {
  it("waits for every view to fade out or in", () => {
    expect(awaitedBy(DEFAULT, EVEN)).toEqual({ slots: [], views: PANEL_IDS });
    expect(awaitedBy(resized("skills"), EXPANDED("skills"))).toEqual({
      slots: [],
      views: PANEL_IDS,
    });
    expect(awaitedBy(EVEN, DEFAULT)).toEqual({ slots: [], views: PANEL_IDS });
  });

  it("waits for the slots that turn into Stripes, not for the one that stays full", () => {
    expect(awaitedBy(EVEN, resized("skills"))).toEqual({
      slots: ["about", "whatIDo", "chatWithMe", "contact"],
      views: [],
    });
  });

  it("waits for the two slots a switch resizes, and for no view", () => {
    expect(awaitedBy(EXPANDED("about"), EXPANDED("contact"))).toEqual({
      slots: ["about", "contact"],
      views: [],
    });
  });

  it("waits for the slots, and no view, where the views stay (mobile)", () => {
    expect(awaitedBy(DEFAULT, EXPANDED("skills"))).toEqual({
      slots: ["about", "whatIDo", "chatWithMe", "contact"],
      views: [],
    });
  });

  it("waits for nothing where nothing changes", () => {
    expect(awaitedBy(DEFAULT, DEFAULT)).toEqual({ slots: [], views: [] });
  });
});

const around = (extra: Partial<Surroundings> = {}): Surroundings => ({
  mobile: false,
  reducedMotion: false,
  ...extra,
});
const go = (state: BoardMotionState, board: BoardState = expandedBoard("skills"), extra = {}) =>
  routeChanged(state, board, around(extra));
const at = (board: BoardState, reducedMotion = false) => initialState(board, reducedMotion);
const endViews = (state: BoardMotionState) =>
  PANEL_IDS.reduce((next, panel) => transitionEnded(next, "views", panel), state);
const endSlots = (state: BoardMotionState) =>
  PANEL_IDS.reduce((next, panel) => transitionEnded(next, "slots", panel), state);

describe("initialState", () => {
  it("rests on the stage of the first route, with nothing to play but the entrance", () => {
    expect(at(expandedBoard("skills"))).toEqual({
      stage: EXPANDED("skills"),
      queue: [],
      awaiting: { slots: [], views: [] },
      scrolling: false,
      titles: [],
    });
    expect(at(DEFAULT_BOARD).titles).toEqual(PANEL_IDS);
  });

  it("has no entrance to wait for with reduced motion", () => {
    expect(at(DEFAULT_BOARD, true).titles).toEqual([]);
  });
});

describe("a Board that has not started", () => {
  it("has no stage yet: the route decides what shows", () => {
    expect(NOT_STARTED.stage).toBeNull();
  });

  it("starts at rest on the stage of the first route, whatever it is: nothing plays", () => {
    expect(go(NOT_STARTED, expandedBoard("skills"))).toEqual(at(expandedBoard("skills")));
    expect(go(NOT_STARTED, DEFAULT_BOARD)).toEqual(at(DEFAULT_BOARD));
  });

  it("skips the entrance with reduced motion", () => {
    expect(go(NOT_STARTED, DEFAULT_BOARD, { reducedMotion: true }).titles).toEqual([]);
  });

  it("is busy: its entrance is still to play", () => {
    expect(isBusy(NOT_STARTED)).toBe(true);
  });
});

describe("routeChanged", () => {
  it("plays towards the route: asking for it again, or for where the queue ends, changes nothing", () => {
    const playing = go(at(DEFAULT_BOARD));
    expect(playing.queue.at(-1)).toEqual(EXPANDED("skills"));
    expect(go(playing)).toBe(playing);
  });

  it("starts the first stage at once and queues the rest", () => {
    expect(go(at(DEFAULT_BOARD))).toMatchObject({
      stage: EVEN,
      queue: [resized("skills"), EXPANDED("skills")],
      awaiting: { slots: [], views: PANEL_IDS },
      scrolling: false,
    });
  });

  it("plays nothing for a route that shows what is on screen", () => {
    const state = at(expandedBoard("skills"));
    expect(go(state)).toBe(state);
  });

  it("goes on to the next stage when the last transition of a stage ends, and rests after the last", () => {
    let state = go(at(DEFAULT_BOARD));
    state = endViews(state);
    expect(state).toMatchObject({ stage: resized("skills"), awaiting: { views: [] } });
    expect(state.awaiting.slots).toHaveLength(4);
    state = endSlots(state);
    expect(state).toMatchObject({ stage: EXPANDED("skills"), queue: [] });
    state = endViews(state);
    expect(state).toMatchObject({ stage: EXPANDED("skills"), awaiting: { slots: [], views: [] } });
    expect(isBusy({ ...state, titles: [] })).toBe(false);
  });

  it("stays on a stage while any of its transitions is still running", () => {
    let state = go(at(DEFAULT_BOARD));
    state = PANEL_IDS.slice(0, 4).reduce(
      (next, panel) => transitionEnded(next, "views", panel),
      state,
    );
    expect(state.stage).toEqual(EVEN);
    expect(state.awaiting.views).toEqual(["contact"]);
  });

  it("ignores the end of a transition nothing waits for", () => {
    const state = go(at(DEFAULT_BOARD));
    expect(transitionEnded(state, "slots", "about")).toBe(state);
    const rested = at(DEFAULT_BOARD);
    expect(transitionEnded(rested, "views", "about")).toBe(rested);
  });

  it("skips a stage that has no transition to wait for", () => {
    // Even slots to an Expanded panel on mobile: the views stay, only the slots resize.
    expect(go(at(DEFAULT_BOARD), expandedBoard("skills"), { mobile: true })).toMatchObject({
      stage: EXPANDED("skills"),
      queue: [],
      awaiting: { slots: ["about", "whatIDo", "chatWithMe", "contact"], views: [] },
    });
  });

  describe("a route change during a sequence", () => {
    it("drops the stages still to play and goes on from the stage on screen", () => {
      let state = go(at(DEFAULT_BOARD), expandedBoard("about"));
      state = endViews(state);
      expect(state.stage).toEqual(resized("about"));

      expect(go(state, DEFAULT_BOARD)).toMatchObject({
        stage: EVEN,
        queue: [DEFAULT],
        awaiting: {
          slots: ["whatIDo", "skills", "chatWithMe", "contact"],
          views: [],
        },
      });
    });

    it("fades the Panels back in at once where they were only fading out", () => {
      const state = go(at(DEFAULT_BOARD), expandedBoard("about"));
      expect(state.stage).toEqual(EVEN);

      const back = go(state, DEFAULT_BOARD);
      expect(back).toMatchObject({ stage: DEFAULT, queue: [], awaiting: { views: PANEL_IDS } });
    });
  });

  describe("with reduced motion", () => {
    it("plays no stage: the Board shows the route at once", () => {
      expect(
        go(at(DEFAULT_BOARD, true), expandedBoard("skills"), { reducedMotion: true }),
      ).toMatchObject({
        stage: EXPANDED("skills"),
        queue: [],
        awaiting: { slots: [], views: [] },
        scrolling: false,
      });
    });
  });

  describe("on mobile", () => {
    it("plays the one stage and rests", () => {
      let state = go(at(DEFAULT_BOARD), expandedBoard("skills"), { mobile: true });
      expect(state).toMatchObject({ stage: EXPANDED("skills"), queue: [] });
      state = endSlots(state);
      expect(state.awaiting).toEqual({ slots: [], views: [] });
    });
  });

  describe("the entrance", () => {
    it("ends when the Board opens a Panel, so the Panels that come back do not replay it", () => {
      expect(go(at(DEFAULT_BOARD)).titles).toEqual([]);
    });

    it("goes on where the Board goes to the default Board", () => {
      const state = { ...at(expandedBoard("skills")), titles: PANEL_IDS };
      expect(go(state, DEFAULT_BOARD).titles).toEqual(PANEL_IDS);
    });
  });
});

describe("scrollingUp", () => {
  it("is busy while the page scrolls up before a switch, and rests when it has", () => {
    const rested = at(expandedBoard("about"));
    expect(isBusy(rested)).toBe(false);
    const scrolling = scrollingUp(rested, true);
    expect(scrolling.scrolling).toBe(true);
    expect(isBusy(scrolling)).toBe(true);
    expect(isBusy(scrollingUp(scrolling, false))).toBe(false);
  });

  it("changes nothing where it already is", () => {
    const rested = at(expandedBoard("about"));
    expect(scrollingUp(rested, false)).toBe(rested);
  });
});

describe("titleFaded", () => {
  it("takes the Panel off the titles still to fade in", () => {
    expect(titleFaded(at(DEFAULT_BOARD), "skills").titles).toEqual(
      PANEL_IDS.filter((panel) => panel !== "skills"),
    );
  });

  it("changes nothing for a Panel that is not waited for", () => {
    const state = at(expandedBoard("skills"));
    expect(titleFaded(state, "skills")).toBe(state);
  });
});

describe("isBusy", () => {
  it("is busy during the entrance and while a stage runs", () => {
    expect(isBusy(at(DEFAULT_BOARD))).toBe(true);
    expect(isBusy(go(at(expandedBoard("skills")), DEFAULT_BOARD))).toBe(true);
  });

  it("is not busy at rest", () => {
    expect(isBusy(at(DEFAULT_BOARD, true))).toBe(false);
    expect(isBusy(at(expandedBoard("skills")))).toBe(false);
  });
});
