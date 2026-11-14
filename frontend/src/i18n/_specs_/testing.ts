import { parse } from "@formatjs/icu-messageformat-parser";
import { createElement } from "octane";
import { IntlProvider } from "../intl-provider.tsrx";
import { enMessages } from "../en/messages";
import type { IntlProviderProps, MessageId } from "../types";

/**
 * A test `wrapper`: an `IntlProvider` with the English messages, `overrides` replacing some.
 * Overrides are ICU strings, parsed here; tests have the parser, the bundle does not.
 */
export function intlWrapper(overrides: Partial<Record<MessageId, string>> = {}) {
  const parsed = Object.fromEntries(
    Object.entries(overrides).map(([id, message]) => [id, parse(message ?? "")]),
  );
  const messages = { ...enMessages, ...parsed };
  return ({ children }: Pick<IntlProviderProps, "children">) =>
    createElement(IntlProvider, { messages }, children);
}
