import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createIntl } from "@formatjs/intl";
import { render, screen } from "@octanejs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { enMessages } from "../../i18n";
import { App } from ".././App.tsrx";

describe("App", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("renders the Landing with the English messages", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>(() => new Promise(() => {})),
    );
    render(App, { props: {} });
    expect(screen.getByRole("button", { name: "Portfolio A.Durnev" })).toBeInTheDocument();
  });

  it("ships the site title in index.html for the time before JS runs", () => {
    // A path, not a URL: jsdom replaces the global `URL`, which `node:fs` then rejects.
    const html = readFileSync(join(import.meta.dirname, "../../../index.html"), "utf8");
    const intl = createIntl({ locale: "en", messages: enMessages });
    expect(html.match(/<title>(.*)<\/title>/)?.[1]).toBe(intl.formatMessage({ id: "site.title" }));
  });
});
