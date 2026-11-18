import type { IntlShape } from "../../../../hooks/use-intl";
import type { CertificateDateValue } from "./types";

/**
 * A Certificate's date as the Visitor reads it: "Jul 2020", or the year alone where the issuer
 * gave no month. UTC both ways, so the month does not move with the Visitor's time zone.
 */
export function formatCertificateDate(intl: IntlShape, { year, month }: CertificateDateValue) {
  return intl.formatDate(`${year}-${String(month ?? 1).padStart(2, "0")}-01T00:00:00Z`, {
    year: "numeric",
    month: month === undefined ? undefined : "short",
    timeZone: "UTC",
  });
}
