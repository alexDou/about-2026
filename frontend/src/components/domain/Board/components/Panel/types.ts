import type { PanelId } from "../../../../../hooks/useRoute";

/** A Panel's colour scheme, named after its background in the palette. */
export type PanelTone = "ink" | "mist" | "teal" | "blue" | "green";

export type PanelProps = {
  panel: PanelId;
  tone: PanelTone;
};
