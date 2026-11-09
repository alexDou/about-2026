import type { enMessages } from "./messages";

/** The id of a UI message. Derived from the English files, so an unknown id is a type error. */
export type MessageId = keyof typeof enMessages;
