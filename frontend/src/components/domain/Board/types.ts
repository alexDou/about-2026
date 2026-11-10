import type { PanelId } from "../../../hooks/useRoute";

/** A Panel's colour scheme, named after its background in the palette. */
export type PanelTone = "ink" | "mist" | "teal" | "blue" | "green";

/**
 * What the Board shows at one moment of an expand or collapse sequence. `layout` is the Panel whose
 * slot fills the Board (`null`: the five slots are even); `views` is what stands in the slots:
 * the Panels, the Stripes and the Expanded panel, or nothing while a slot changes size.
 */
export type BoardStage =
  | { readonly layout: null; readonly views: "panels" | "none" }
  | { readonly layout: PanelId; readonly views: "none" | "expanded" };

/** What a `ref` holds: the element once it is mounted. */
export type RefObject<T> = { readonly current: T | null };
