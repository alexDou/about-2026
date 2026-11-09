import type { IntlShape } from "@formatjs/intl";
import { createContext } from "octane";

/**
 * The intl object an `IntlProvider` hands down; `null` outside of one.
 * Internal to the binding: everything else reads it through `useIntl()`, which refuses the `null`.
 */
export const IntlContext = createContext<IntlShape | null>(null);
