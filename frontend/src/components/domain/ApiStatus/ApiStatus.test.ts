import { render, screen } from "@octanejs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { intlWrapper } from "../../../i18n";
import { ApiStatus } from "./ApiStatus.tsrx";

describe("ApiStatus", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("shows ok once the health check succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(Response.json({ status: "ok" })),
    );
    render(ApiStatus, { props: {}, wrapper: intlWrapper() });
    expect(screen.getByText("API: checking")).toBeInTheDocument();
    expect(await screen.findByText("API: ok")).toBeInTheDocument();
  });

  it("shows down when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn<typeof fetch>().mockRejectedValue(new TypeError("network")));
    render(ApiStatus, { props: {}, wrapper: intlWrapper() });
    expect(await screen.findByText("API: down")).toBeInTheDocument();
  });

  it("takes its text from the messages", async () => {
    vi.stubGlobal("fetch", vi.fn<typeof fetch>().mockRejectedValue(new TypeError("network")));
    render(ApiStatus, {
      props: {},
      wrapper: intlWrapper({
        "landing.status.checking": "Backend: checking",
        "landing.status.down": "Backend: unreachable",
      }),
    });
    expect(screen.getByText("Backend: checking")).toBeInTheDocument();
    expect(await screen.findByText("Backend: unreachable")).toBeInTheDocument();
  });
});
