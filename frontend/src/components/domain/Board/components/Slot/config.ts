/** What stands in a slot: the Panel, a Stripe, or the Expanded panel. */
export const SLOT_VIEWS = { panel: "panel", stripe: "stripe", expanded: "expanded" } as const;

/** The CSS properties whose transitions end a stage (see the slot's stylesheet): a slot's size, a view's fade. */
export const RESIZE_PROPERTY = "flex-grow";
export const FADE_PROPERTY = "opacity";
