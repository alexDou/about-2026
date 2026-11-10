import type { PanelId } from "../../../hooks/useRoute";
import type { MessageId } from "../../../i18n";

/** The Panels' colour schemes, each named after its background in the palette. */
export const PANEL_TONES = ["ink", "mist", "teal", "blue", "green"] as const;

/**
 * What stands in the slots at one moment of a sequence: the Panels, the Stripes and the Expanded
 * panel, or nothing while a slot changes size.
 */
export const STAGE_VIEWS = { panels: "panels", none: "none", expanded: "expanded" } as const;

/** The tone of each Panel: the palette in Board order, left to right and top to bottom. */
export const TONE_BY_PANEL = {
  about: "ink",
  whatIDo: "mist",
  skills: "teal",
  chatWithMe: "blue",
  contact: "green",
} as const satisfies Record<PanelId, (typeof PANEL_TONES)[number]>;

/** The message that titles each Panel. */
export const TITLE_BY_PANEL = {
  about: "board.panel.about.title",
  whatIDo: "board.panel.whatIDo.title",
  skills: "board.panel.skills.title",
  chatWithMe: "board.panel.chatWithMe.title",
  contact: "board.panel.contact.title",
} as const satisfies Record<PanelId, MessageId>;

/** The message that titles each Expanded panel's close button. */
export const CLOSE_BY_PANEL = {
  about: "board.panel.about.close",
  whatIDo: "board.panel.whatIDo.close",
  skills: "board.panel.skills.close",
  chatWithMe: "board.panel.chatWithMe.close",
  contact: "board.panel.contact.close",
} as const satisfies Record<PanelId, MessageId>;

/** The palette token (tokens.css) that colours each Panel: the browser's `theme-color` follows it. */
export const COLOR_TOKEN_BY_PANEL = {
  about: "--panel-about",
  whatIDo: "--panel-what-i-do",
  skills: "--panel-skills",
  chatWithMe: "--panel-chat",
  contact: "--panel-contact",
} as const satisfies Record<PanelId, `--${string}`>;
