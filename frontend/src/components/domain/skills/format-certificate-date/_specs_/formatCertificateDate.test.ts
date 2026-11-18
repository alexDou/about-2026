import { describe, expect, it } from "vitest";
import { createIntl } from "@formatjs/intl";
import { formatCertificateDate } from "..";

const intl = createIntl({ locale: "en" });

describe("formatCertificateDate", () => {
  it("gives the short month and the year", () => {
    expect(formatCertificateDate(intl, { year: 2020, month: 7 })).toBe("Jul 2020");
  });

  it("gives the year alone when the issuer gave no month", () => {
    expect(formatCertificateDate(intl, { year: 2025 })).toBe("2025");
  });

  it("does not move with the time zone: January 1st is still January", () => {
    expect(formatCertificateDate(intl, { year: 2024, month: 1 })).toBe("Jan 2024");
  });
});
