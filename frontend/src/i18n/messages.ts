import board from "./en/board.json";
import landing from "./en/landing.json";
import site from "./en/site.json";

/**
 * The English messages, one file per area. They are the source of `MessageId`.
 * Tests and the type check see the ICU strings; in the build, tools/messages-loader.ts has compiled each to its AST.
 */
export const enMessages = { ...site, ...landing, ...board };
