/** Every badge is drawn in the same square, so all six scale alike. */
export const VIEW_BOX_SIZE = 120;

/** Where a run of text on a circle goes: over the top or under the bottom. */
export const ARC_SIDES = { top: "top", bottom: "bottom" } as const;

/** The separator in a badge's text that splits it between the top and the bottom arc. */
export const ARC_TEXT_SEPARATOR = " / ";
