import type { OverviewGroup, OverviewHeading, OverviewsState } from "./types";

/** Every overview and every heading closed: the Skills Panel as it opens. */
export const ALL_CLOSED: OverviewsState = { skills: {}, headings: {} };

/** The overview of `skill` is open. */
export const skillOpen = (state: OverviewsState, skill: string): boolean =>
  state.skills[skill] === true;

/** The heading `heading` is in its open state. */
export const headingOpen = (state: OverviewsState, heading: string): boolean =>
  state.headings[heading] === true;

/**
 * The headings of one group, group first: the group's heading covers every Skill beneath it,
 * its subgroups' included, and each subgroup's covers its own. A heading acts on nothing outside.
 */
export function headingsOf(group: OverviewGroup): OverviewHeading[] {
  const ids = (skills: readonly { readonly id: string }[]) => skills.map((skill) => skill.id);
  const own = ids(group.skills);
  const subgroups = group.subgroups.map((subgroup) => ({
    id: subgroup.id,
    skills: ids(subgroup.skills),
  }));
  return [
    { id: group.id, skills: [...own, ...subgroups.flatMap((subgroup) => subgroup.skills)] },
    ...subgroups,
  ];
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
  return { skills: state.skills, headings: next };
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
 * A heading was clicked: its state flips and every Skill beneath it is set to match (open all, or
 * close all). The group's other headings follow by the rule. Returns `state` for an unknown heading.
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
  return followSkills({ skills, headings: { ...state.headings, [heading]: open } }, headings);
}
