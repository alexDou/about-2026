import type { PanelId } from "../../../../../hooks/useRoute";
import type { MessageId } from "../../../../../i18n";

/** The message that gives a Panel its Sublabel. A Panel without an entry has no Sublabel. */
export const SUBLABEL_BY_PANEL: Readonly<Partial<Record<PanelId, MessageId>>> = {
  whatIDo: "board.panel.whatIDo.sublabel",
  chatWithMe: "board.panel.chatWithMe.sublabel",
};
