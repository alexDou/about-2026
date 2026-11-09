import { renderHook } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { IntlProvider, intlWrapper } from "../../../i18n";
import { type IntlShape, useIntl } from "..";

// Checked by the typecheck (tsrs), not at run time.
const formatUnknownId = (intl: IntlShape) =>
  // @ts-expect-error: "landing.logo.title" is not a MessageId.
  intl.formatMessage({ id: "landing.logo.title" });

describe("useIntl", () => {
  it("formats a site message by id inside the provider", () => {
    const { result } = renderHook(() => useIntl().formatMessage({ id: "site.title" }), {
      wrapper: IntlProvider,
    });
    expect(result.current).toBe("A.Durnev portfolio");
  });

  it("fills a message's placeholders from values", () => {
    const { result } = renderHook(
      () => useIntl().formatMessage({ id: "site.title" }, { owner: "Ada" }),
      { wrapper: intlWrapper({ "site.title": "Portfolio of {owner}" }) },
    );
    expect(result.current).toBe("Portfolio of Ada");
  });

  it("takes only the ids of the English messages", () => {
    // The real check is the @ts-expect-error in formatUnknownId: tsrs fails if that call type-checks.
    expect(formatUnknownId).toBeTypeOf("function");
  });

  it("refuses to run outside an IntlProvider", () => {
    expect(() => renderHook(() => useIntl())).toThrow("useIntl() needs an <IntlProvider> above it");
  });
});
