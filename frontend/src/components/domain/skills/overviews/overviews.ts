import { createScope } from "octane/signals";
import { ALL_CLOSED, groupToggled, headingToggled, skillToggled } from "./state";
import type { OverviewGroup, OverviewHeading, OverviewsState } from "./types";

/**
 * The Skills Panel's open overviews and heading states, shared by its components: there is one
 * Skills Panel in the document. The state is a value in one signal; the rules for changing it
 * are in `state.ts`.
 */
const scope = createScope({ scopeKey: "skills-overviews" });
const state$ = scope.signal$<OverviewsState>("state", ALL_CLOSED);

/** What is open: read it with `groupOpen`, `headingOpen` and `skillOpen`. */
export const overviews$ = scope.derived$("overviews", () => state$.get());
/** A Skill's arrow was clicked; `headings` are those of its group. */
export const toggleSkill = (headings: readonly OverviewHeading[], skill: string) =>
  state$.set((state) => skillToggled(state, headings, skill));
/** A subgroup heading was clicked; `headings` are those of its group. */
export const toggleHeading = (headings: readonly OverviewHeading[], heading: string) =>
  state$.set((state) => headingToggled(state, headings, heading));
/** A group's heading was clicked. */
export const toggleGroup = (group: OverviewGroup) =>
  state$.set((state) => groupToggled(state, group));
/** The Skills Panel is gone: the next one starts closed. */
export const reset = () => state$.set(ALL_CLOSED);
