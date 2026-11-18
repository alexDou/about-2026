/** Which overviews are open, and the state of each group and subgroup heading. Absent means closed. */
export type OverviewsState = {
  readonly skills: Readonly<Record<string, boolean>>;
  readonly headings: Readonly<Record<string, boolean>>;
};

/** A group or subgroup heading and every Skill beneath it, a group's subgroups' Skills included. */
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
