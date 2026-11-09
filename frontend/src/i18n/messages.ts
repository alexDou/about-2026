import type { MessageFormatElement } from "@formatjs/icu-messageformat-parser";
import board from "./en/board.json";
import landing from "./en/landing.json";
import site from "./en/site.json";

const files = { ...site, ...landing, ...board };

/**
 * The English messages, one file per area, as FormatJS ASTs (`formatjs compile --ast`). They are the
 * source of `MessageId`. JSON types the AST's `type` as a plain number, hence the cast.
 */
export const enMessages = files as unknown as Readonly<
  Record<keyof typeof files, MessageFormatElement[]>
>;
