import { describe, expect, it } from "vitest";
import { DEFAULT_BOARD, expandedBoard } from "../../../../../../hooks/useRoute";
import type { BoardStage } from "../../../types";
import { initialSequence, planStages, sequenceReducer, settledStage } from "../sequence";
import type { SequenceState } from "../types";

const DEFAULT: BoardStage = { layout: null, views: "panels" };
const EVEN: BoardStage = { layout: null, views: "none" };
const resized = (panel: "about" | "skills" | "contact"): BoardStage => ({
  layout: panel,
  views: "none",
});
const EXPANDED = (panel: "about" | "skills" | "contact"): BoardStage => ({
  layout: panel,
  views: "expanded",
});

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

const go = (state: SequenceState, board = expandedBoard("skills"), extra = {}) =>
  sequenceReducer(state, { type: "go", board, mobile: false, scrolled: false, ...extra });

describe("sequenceReducer", () => {
  it("starts at rest on the stage of the first route, with nothing to play", () => {
    expect(initialSequence(expandedBoard("skills"))).toEqual({
      goal: "/skills",
      stage: EXPANDED("skills"),
      queue: [],
      running: false,
      scrolling: false,
      step: 0,
    });
  });

  it("starts the first stage at once and queues the rest", () => {
    const state = go(initialSequence(DEFAULT_BOARD));
    expect(state).toMatchObject({
      stage: EVEN,
      queue: [resized("skills"), EXPANDED("skills")],
      running: true,
      scrolling: false,
    });
  });

  it("goes on to the next stage when one is done, and rests after the last", () => {
    let state = go(initialSequence(DEFAULT_BOARD));
    state = sequenceReducer(state, { type: "done", step: state.step });
    expect(state).toMatchObject({ stage: resized("skills"), running: true });
    state = sequenceReducer(state, { type: "done", step: state.step });
    expect(state).toMatchObject({ stage: EXPANDED("skills"), queue: [], running: true });
    state = sequenceReducer(state, { type: "done", step: state.step });
    expect(state).toMatchObject({ stage: EXPANDED("skills"), running: false });
  });

  it("ignores a done of a stage that is no longer on screen", () => {
    let state = go(initialSequence(DEFAULT_BOARD));
    const late = state.step;
    state = sequenceReducer(state, { type: "done", step: late });
    expect(sequenceReducer(state, { type: "done", step: late })).toBe(state);
  });

  it("ignores a done at rest", () => {
    const state = initialSequence(DEFAULT_BOARD);
    expect(sequenceReducer(state, { type: "done", step: state.step })).toBe(state);
  });

  it("takes the route as its goal", () => {
    expect(go(initialSequence(DEFAULT_BOARD)).goal).toBe("/skills");
    expect(go(initialSequence(expandedBoard("skills")), DEFAULT_BOARD).goal).toBe("/explore");
  });

  it("plays nothing for a route that shows what is on screen", () => {
    const state = initialSequence(expandedBoard("skills"));
    expect(go(state)).toMatchObject({ stage: EXPANDED("skills"), queue: [], running: false });
  });

  describe("switching from a scrolled page", () => {
    const open = initialSequence(expandedBoard("about"));

    it("scrolls to the top first, with the stage on screen unchanged", () => {
      expect(go(open, expandedBoard("contact"), { scrolled: true })).toMatchObject({
        stage: EXPANDED("about"),
        queue: [EXPANDED("contact")],
        running: true,
        scrolling: true,
      });
    });

    it("starts the first stage when the scroll ends", () => {
      const scrolling = go(open, expandedBoard("contact"), { scrolled: true });
      expect(sequenceReducer(scrolling, { type: "scrolled", step: scrolling.step })).toMatchObject({
        stage: EXPANDED("contact"),
        queue: [],
        running: true,
        scrolling: false,
      });
    });

    it("ignores the end of a scroll that was dropped", () => {
      const scrolling = go(open, expandedBoard("contact"), { scrolled: true });
      const dropped = go(scrolling, DEFAULT_BOARD, { scrolled: true });
      expect(sequenceReducer(dropped, { type: "scrolled", step: scrolling.step })).toBe(dropped);
    });

    it("skips the scroll at the top", () => {
      expect(go(open, expandedBoard("contact"))).toMatchObject({
        stage: EXPANDED("contact"),
        scrolling: false,
      });
    });

    it("skips the scroll where the Board is not switching", () => {
      expect(go(open, DEFAULT_BOARD, { scrolled: true })).toMatchObject({
        stage: resized("about"),
        scrolling: false,
      });
    });
  });

  describe("a route change during a sequence", () => {
    it("drops the stages still to play and goes on from the stage on screen", () => {
      let state = go(initialSequence(DEFAULT_BOARD), expandedBoard("about"));
      state = sequenceReducer(state, { type: "done", step: state.step });
      expect(state.stage).toEqual(resized("about"));

      const back = go(state, DEFAULT_BOARD);
      expect(back).toMatchObject({ stage: EVEN, queue: [DEFAULT], running: true });
    });

    it("ignores the end of the stage it dropped", () => {
      const state = go(initialSequence(DEFAULT_BOARD), expandedBoard("about"));
      const back = go(state, DEFAULT_BOARD);
      expect(sequenceReducer(back, { type: "done", step: state.step })).toBe(back);
    });

    it("fades the Panels back in at once where they were only fading out", () => {
      const state = go(initialSequence(DEFAULT_BOARD), expandedBoard("about"));
      expect(state.stage).toEqual(EVEN);

      const back = go(state, DEFAULT_BOARD);
      expect(back).toMatchObject({ stage: DEFAULT, queue: [], running: true });
      expect(sequenceReducer(back, { type: "done", step: back.step }).running).toBe(false);
    });
  });

  describe("on mobile", () => {
    it("plays the one stage and rests", () => {
      let state = go(initialSequence(DEFAULT_BOARD), expandedBoard("skills"), { mobile: true });
      expect(state).toMatchObject({ stage: EXPANDED("skills"), queue: [], running: true });
      state = sequenceReducer(state, { type: "done", step: state.step });
      expect(state.running).toBe(false);
    });

    it("scrolls to the top before switching from a scrolled page", () => {
      const state = go(initialSequence(expandedBoard("about")), expandedBoard("contact"), {
        mobile: true,
        scrolled: true,
      });
      expect(state).toMatchObject({
        stage: EXPANDED("about"),
        queue: [EXPANDED("contact")],
        scrolling: true,
      });
    });
  });
});
