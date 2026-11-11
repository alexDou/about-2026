import type { OctaneNode } from "octane";
import type { PanelTone } from "../../types";
import type { SLOT_VIEWS } from "./config";

/** What stands in a slot: the Panel, a Stripe, or the Expanded panel. It sets the slot's size. */
export type SlotView = (typeof SLOT_VIEWS)[keyof typeof SLOT_VIEWS];

export type SlotProps = {
  tone: PanelTone;
  view: SlotView;
  children?: OctaneNode;
};
