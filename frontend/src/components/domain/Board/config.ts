import type { MessageId } from "../../../i18n";
import type { PanelId } from "../../../hooks/useRoute";

/** The message that titles each Panel. */
export const TITLE_BY_PANEL = {
  about: "board.panel.about.title",
  whatIDo: "board.panel.whatIDo.title",
  skills: "board.panel.skills.title",
  chatWithMe: "board.panel.chatWithMe.title",
  contact: "board.panel.contact.title",
} as const satisfies Record<PanelId, MessageId>;
