import { render, screen } from "@octanejs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { intlWrapper } from "../../i18n";
import { LandingPage } from "./LandingPage.tsrx";

describe("LandingPage", () => {
  // The health check never answers, so the badge stays on "checking".
  beforeEach(() =>
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>(() => new Promise(() => {})),
    ),
  );
  afterEach(() => vi.unstubAllGlobals());

  it("names the logo, the status badge and the document in English", () => {
    render(LandingPage, { props: {}, wrapper: intlWrapper() });
    expect(screen.getByRole("button", { name: "Portfolio A.Durnev" })).toBeInTheDocument();
    expect(screen.getByText("API: checking")).toBeInTheDocument();
    expect(document.title).toBe("A.Durnev portfolio");
  });

  it("takes all its text from the messages", () => {
    render(LandingPage, {
      props: {},
      wrapper: intlWrapper({
        "site.title": "Site title",
        "landing.logo.label": "Logo label",
        "landing.status.checking": "Badge text",
      }),
    });
    expect(screen.getByRole("button", { name: "Logo label" })).toBeInTheDocument();
    expect(screen.getByText("Badge text")).toBeInTheDocument();
    expect(document.title).toBe("Site title");
  });
});
