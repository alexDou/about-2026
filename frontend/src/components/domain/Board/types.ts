import type { CHANGE_KINDS, PANEL_TONES } from "./config";

/** How a change of route moves the Board: a Panel opens, closes, or another takes its place. */
export type ChangeKind = (typeof CHANGE_KINDS)[keyof typeof CHANGE_KINDS];

/** A Panel's colour scheme, named after its background in the palette. */
export type PanelTone = (typeof PANEL_TONES)[number];

/** What a `ref` holds: the element once it is mounted. */
export type RefObject<T> = { readonly current: T | null };
