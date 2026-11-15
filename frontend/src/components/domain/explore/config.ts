import type { PanelId } from "../../../hooks/use-route";
import type { MessageId } from "../../../i18n";

/** The Panels' colour schemes, each named after its background in the palette. */
export const PANEL_TONES = ["ink", "mist", "teal", "blue", "green"] as const;

/** The ways a change of route moves Explore: a Panel opens, closes, or another one takes its place. */
export const CHANGE_KINDS = { open: "open", close: "close", switch: "switch" } as const;

/** The tone of each Panel: the palette in Explore order, left to right and top to bottom. */
export const TONE_BY_PANEL = {
  about: "ink",
  whatIDo: "mist",
  skills: "teal",
  chatWithMe: "blue",
  contact: "green",
} as const satisfies Record<PanelId, (typeof PANEL_TONES)[number]>;

/** The message that titles each Panel. */
export const TITLE_BY_PANEL = {
  about: "explore.panel.about.title",
  whatIDo: "explore.panel.whatIDo.title",
  skills: "explore.panel.skills.title",
  chatWithMe: "explore.panel.chatWithMe.title",
  contact: "explore.panel.contact.title",
} as const satisfies Record<PanelId, MessageId>;

/** The message that titles each Expanded panel's close button. */
export const CLOSE_BY_PANEL = {
  about: "explore.panel.about.close",
  whatIDo: "explore.panel.whatIDo.close",
  skills: "explore.panel.skills.close",
  chatWithMe: "explore.panel.chatWithMe.close",
  contact: "explore.panel.contact.close",
} as const satisfies Record<PanelId, MessageId>;

/** The palette token (tokens.css) that colours each Panel: the browser's `theme-color` follows it. */
export const COLOR_TOKEN_BY_PANEL = {
  about: "--panel-about",
  whatIDo: "--panel-what-i-do",
  skills: "--panel-skills",
  chatWithMe: "--panel-chat",
  contact: "--panel-contact",
} as const satisfies Record<PanelId, `--${string}`>;
