import type { MessageFormatElement } from "@formatjs/icu-messageformat-parser";
import type { OctaneNode } from "octane";
import type { enMessages } from "./messages";

/** The id of a UI message. Derived from the English files, so an unknown id is a type error. */
export type MessageId = keyof typeof enMessages;

// Types `formatMessage({ id })` across the program: an unknown id fails the type check.
declare global {
  namespace FormatjsIntl {
    interface Message {
      ids: MessageId;
    }
  }
}

/** One message per id, as a FormatJS AST: the bundle has no ICU parser. */
export type Messages = Readonly<Record<MessageId, MessageFormatElement[]>>;

export type IntlProviderProps = {
  /** Replaces the English messages (tests). */
  messages?: Messages;
  children?: OctaneNode;
};
