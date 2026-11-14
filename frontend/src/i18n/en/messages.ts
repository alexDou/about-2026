import type { MessageFormatElement } from "@formatjs/icu-messageformat-parser";
import about from "./about.json";
import board from "./board.json";
import landing from "./landing.json";
import offline from "./offline.json";
import site from "./site.json";

const files = { ...site, ...landing, ...board, ...offline, ...about };

/**
 * The English messages, one file per area, as FormatJS ASTs (`formatjs compile --ast`). They are the
 * source of `MessageId`. JSON types the AST's `type` as a plain number, hence the cast.
 */
export const enMessages = files as unknown as Readonly<
  Record<keyof typeof files, MessageFormatElement[]>
>;
