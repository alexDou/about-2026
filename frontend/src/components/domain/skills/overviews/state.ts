import type { OverviewGroup, OverviewHeading, OverviewsState } from "./types";

/** Every overview and every heading closed: the Skills Panel as it opens. */
export const ALL_CLOSED: OverviewsState = { groups: {}, skills: {}, headings: {} };

/** The overview of `skill` is open. */
export const skillOpen = (state: OverviewsState, skill: string): boolean =>
  state.skills[skill] === true;

/** The group `group` shows its Skills. */
export const groupOpen = (state: OverviewsState, group: string): boolean =>
  state.groups[group] === true;

/** The subgroup heading `heading` is in its open state. */
export const headingOpen = (state: OverviewsState, heading: string): boolean =>
  state.headings[heading] === true;

/**
 * The headings of one group: one per subgroup, over that subgroup's own Skills. The group has no
 * heading in the rule: its state is whether it shows.
 */
export function headingsOf(group: OverviewGroup): OverviewHeading[] {
  return group.subgroups.map((subgroup) => ({
    id: subgroup.id,
    skills: subgroup.skills.map((skill) => skill.id),
  }));
}

/**
 * The heading rule after Skills changed: a heading whose Skills are all closed is closed, and one
 * whose Skills are all open is open. Any mix leaves its state alone, so the next click on a
 * heading always does something visible.
 */
function followSkills(state: OverviewsState, headings: readonly OverviewHeading[]): OverviewsState {
  const next = { ...state.headings };
  for (const heading of headings) {
    if (heading.skills.length === 0) continue;
    if (heading.skills.every((skill) => skillOpen(state, skill))) next[heading.id] = true;
    else if (heading.skills.every((skill) => !skillOpen(state, skill))) next[heading.id] = false;
  }
  return { ...state, headings: next };
}

/** A Skill's arrow was clicked: its overview flips, and the headings of its group follow the rule. */
export function skillToggled(
  state: OverviewsState,
  headings: readonly OverviewHeading[],
  skill: string,
): OverviewsState {
  const flipped = { ...state, skills: { ...state.skills, [skill]: !skillOpen(state, skill) } };
  return followSkills(flipped, headings);
}

/**
 * A subgroup heading was clicked: its state flips and every Skill beneath it is set to match (open
 * all, or close all). Returns `state` for an unknown heading.
 */
export function headingToggled(
  state: OverviewsState,
  headings: readonly OverviewHeading[],
  heading: string,
): OverviewsState {
  const clicked = headings.find((candidate) => candidate.id === heading);
  if (!clicked) return state;
  const open = !headingOpen(state, heading);
  const skills = { ...state.skills };
  for (const skill of clicked.skills) skills[skill] = open;
  return followSkills(
    { ...state, skills, headings: { ...state.headings, [heading]: open } },
    headings,
  );
}

/**
 * A group's heading was clicked: the group opens with every overview in it (so every subgroup
 * heading follows and opens), or closes with them. Opening and closing Skills by hand never
 * touches the group.
 */
export function groupToggled(state: OverviewsState, group: OverviewGroup): OverviewsState {
  const open = !groupOpen(state, group.id);
  const skills = { ...state.skills };
  const ids = [...group.skills, ...group.subgroups.flatMap((subgroup) => subgroup.skills)];
  for (const skill of ids) skills[skill.id] = open;
  return followSkills(
    { ...state, skills, groups: { ...state.groups, [group.id]: open } },
    headingsOf(group),
  );
}
