import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, getJson } from "../client";

describe("getJson", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("prefixes /api and parses JSON", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ status: "ok" }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(getJson("/health")).resolves.toEqual({ status: "ok" });
    expect(fetchMock).toHaveBeenCalledWith("/api/health", expect.any(Object));
  });

  it("throws ApiError on a non-2xx response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(new Response("", { status: 503 })),
    );
    await expect(getJson("/health")).rejects.toBeInstanceOf(ApiError);
  });
});
