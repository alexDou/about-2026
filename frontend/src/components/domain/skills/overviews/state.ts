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

/** Every Skill of a group: its own first, then those of each subgroup. */
const skillsOf = (group: OverviewGroup) => [
  ...group.skills,
  ...group.subgroups.flatMap((subgroup) => subgroup.skills),
];

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
  for (const skill of skillsOf(group)) skills[skill.id] = open;
  return followSkills(
    { ...state, skills, groups: { ...state.groups, [group.id]: open } },
    headingsOf(group),
  );
}

/**
 * Expand all or Collapse all: every group shows (or hides) its Skills, and every overview is open
 * (or closed). The subgroup headings follow by the rule, so they end open or closed with them.
 */
export function allSet(
  state: OverviewsState,
  groups: readonly OverviewGroup[],
  open: boolean,
): OverviewsState {
  const opened = { ...state.groups };
  const skills = { ...state.skills };
  for (const group of groups) {
    opened[group.id] = open;
    for (const skill of skillsOf(group)) skills[skill.id] = open;
  }
  return followSkills({ ...state, groups: opened, skills }, groups.flatMap(headingsOf));
}

/**
 * Where Expand all belongs, read from what is open: `true` when every group and every overview is
 * open, `false` when every overview is closed (the groups may stay open), `undefined` for a mix,
 * which leaves the switch where it is.
 */
export function expandedOf(
  state: OverviewsState,
  groups: readonly OverviewGroup[],
): boolean | undefined {
  const skills = groups.flatMap(skillsOf);
  if (
    groups.every((group) => groupOpen(state, group.id)) &&
    skills.every((skill) => skillOpen(state, skill.id))
  ) {
    return true;
  }
  if (skills.every((skill) => !skillOpen(state, skill.id))) return false;
  return undefined;
}
