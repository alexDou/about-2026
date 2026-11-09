import { createIntl, createIntlCache } from "@formatjs/intl";
import { useMemo } from "octane";
import { IntlContext } from "./context";
import { enMessages } from "./messages";
import type { IntlProviderProps } from "./types";

/** The site's only locale for now. */
const LOCALE = "en";

/** Shared by every intl object, so each formatter is built once. */
const cache = createIntlCache();

/** Makes the site messages formattable below it through `useIntl()`. Wraps the app. */
export function IntlProvider({ messages = enMessages, children }: IntlProviderProps) @{
  // oxlint-disable-next-line react-hooks/exhaustive-deps -- Octane infers [messages]; a list would be redundant.
  const intl = useMemo(() =>
    createIntl({ locale: LOCALE, defaultLocale: LOCALE, messages }, cache),
  );
  <IntlContext value={intl}>{children}</IntlContext>;
}
