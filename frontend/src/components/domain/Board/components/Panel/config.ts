import type { PanelId } from "../../../../../hooks/useRoute";
import type { MessageId } from "../../../../../i18n";

/** The message that titles each Panel. */
export const TITLE_BY_PANEL = {
  about: "board.panel.about.title",
  whatIDo: "board.panel.whatIDo.title",
  skills: "board.panel.skills.title",
  chatWithMe: "board.panel.chatWithMe.title",
  contact: "board.panel.contact.title",
} as const satisfies Record<PanelId, MessageId>;

/** The message that gives a Panel its Sublabel. A Panel without an entry has no Sublabel. */
export const SUBLABEL_BY_PANEL: Readonly<Partial<Record<PanelId, MessageId>>> = {
  whatIDo: "board.panel.whatIDo.sublabel",
  chatWithMe: "board.panel.chatWithMe.sublabel",
};
