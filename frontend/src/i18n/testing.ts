import { createElement } from "octane";
import { IntlProvider } from "./IntlProvider.tsrx";
import { enMessages } from "./messages";
import type { IntlProviderProps, Messages } from "./types";

/** A test `wrapper`: an `IntlProvider` with the English messages, `overrides` replacing some. */
export function intlWrapper(overrides: Partial<Messages> = {}) {
  const messages = { ...enMessages, ...overrides };
  return ({ children }: Pick<IntlProviderProps, "children">) =>
    createElement(IntlProvider, { messages }, children);
}
