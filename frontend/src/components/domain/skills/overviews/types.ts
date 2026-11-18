/**
 * What shows in the Skills Panel: which groups are open, which overviews are open, and the state
 * of each subgroup heading. Absent means closed.
 */
export type OverviewsState = {
  readonly groups: Readonly<Record<string, boolean>>;
  readonly skills: Readonly<Record<string, boolean>>;
  readonly headings: Readonly<Record<string, boolean>>;
};

/** A subgroup heading and the Skills beneath it. A group's state is whether it shows: no heading rule. */
export type OverviewHeading = {
  readonly id: string;
  readonly skills: readonly string[];
};

/** The shape of a group the headings are read from: the chunk's own, matched by the page's content. */
export type OverviewGroup = {
  readonly id: string;
  readonly skills: readonly { readonly id: string }[];
  readonly subgroups: readonly {
    readonly id: string;
    readonly skills: readonly { readonly id: string }[];
  }[];
};
