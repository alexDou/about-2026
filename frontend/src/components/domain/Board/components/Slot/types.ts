import type { OctaneNode } from "octane";
import type { PanelTone } from "../../types";

/** What stands in a slot: the Panel, a Stripe, or the Expanded panel. It sets the slot's size and the view's fade. */
export type SlotView = "panel" | "stripe" | "expanded";

export type SlotProps = {
  tone: PanelTone;
  view: SlotView;
  /** The view is visible; otherwise it is faded out and out of reach (`inert`). */
  shown: boolean;
  /** The slot takes part in the Board's entrance. */
  entering: boolean;
  children?: OctaneNode;
};
