import board from "./en/board.json";
import landing from "./en/landing.json";
import site from "./en/site.json";

/** The English messages, one file per area. They are the source of `MessageId`. */
export const enMessages = { ...site, ...landing, ...board };
