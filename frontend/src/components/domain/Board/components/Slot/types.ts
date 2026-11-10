import type { OctaneNode } from "octane";
import type { PanelId } from "../../../../../hooks/useRoute";
import type { PanelTone } from "../../types";
import type { SLOT_VIEWS } from "./config";

/** What stands in a slot: the Panel, a Stripe, or the Expanded panel. It sets the slot's size and the view's fade. */
export type SlotView = (typeof SLOT_VIEWS)[keyof typeof SLOT_VIEWS];

export type SlotProps = {
  /** The Panel whose place this is: the slot tells the Board's motion when its transitions end. */
  panel: PanelId;
  tone: PanelTone;
  view: SlotView;
  /** The view is visible; otherwise it is faded out and out of reach (`inert`). */
  shown: boolean;
  children?: OctaneNode;
};
