import type { OctaneNode } from "octane";
import type { BoardState } from "../../../hooks/useRoute";

/** A Panel's colour scheme, named after its background in the palette. */
export type PanelTone = "ink" | "mist" | "teal" | "blue" | "green";

export type BoardProps = {
  /** What the Board shows: no Panel open, or one Expanded panel. */
  board: BoardState;
  /** The Expanded panel's page: shown in the Expanded panel while a Panel is open. */
  children?: OctaneNode;
};
