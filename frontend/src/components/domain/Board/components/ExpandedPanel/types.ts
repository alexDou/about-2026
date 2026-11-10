import type { OctaneNode } from "octane";
import type { PanelTone } from "../../types";

export type ExpandedPanelProps = {
  tone: PanelTone;
  /** The close button's `title` and accessible name, e.g. "Close Skills". */
  closeLabel: string;
  /** Closes the Panel: the close button and Escape call it. */
  onClose: () => void;
  /** The Panel's page. */
  children?: OctaneNode;
};
