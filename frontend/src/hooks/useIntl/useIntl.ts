import { use } from "octane";
import { IntlContext } from "../../i18n";
import type { IntlShape } from "./types";

/** The intl object of the nearest `IntlProvider`: `formatMessage({ id }, values)` and friends. */
export function useIntl(): IntlShape {
  const intl = use(IntlContext);
  if (intl === null) throw new Error("useIntl() needs an <IntlProvider> above it");
  return intl;
}
