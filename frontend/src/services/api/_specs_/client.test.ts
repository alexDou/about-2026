import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, getJson, postJson } from "../client";
import type { ChallengeResponse } from "../types";

afterEach(() => vi.unstubAllGlobals());

function stubFetch(response: Response) {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("getJson", () => {
  it("prefixes /api and parses JSON", async () => {
    const fetchMock = stubFetch(Response.json({ status: "ok" }));
    await expect(getJson("/health")).resolves.toEqual({ status: "ok" });
    expect(fetchMock).toHaveBeenCalledWith("/api/health", expect.any(Object));
  });

  it("throws ApiError on a non-2xx response", async () => {
    stubFetch(new Response("", { status: 503 }));
    await expect(getJson("/health")).rejects.toBeInstanceOf(ApiError);
  });

  it("parses the ALTCHA v2 challenge the backend sends", async () => {
    // The same JSON as `CHALLENGE_JSON` in backend/tests/contact/test_models.py.
    const challenge = {
      parameters: {
        algorithm: "PBKDF2/SHA-256",
        cost: 5000,
        keyLength: 32,
        keyPrefix: "00",
        nonce: "359789ddd71a7f311103bab530dfe498",
        salt: "efa12180eee8848e8cd0af47bf12c4b0",
        expiresAt: 1795179859,
      },
      signature: "c6ab2614258fd40c2b41339078d1742fc641f91c581e63f2ed2dabf2f1bf7a1e",
    } satisfies ChallengeResponse;
    stubFetch(Response.json(challenge));
    await expect(getJson<ChallengeResponse>("/contact/challenge")).resolves.toEqual(challenge);
  });
});

describe("postJson", () => {
  it("posts the body as JSON under /api", async () => {
    const fetchMock = stubFetch(new Response(null, { status: 204 }));
    await expect(postJson("/contact", { name: "Ada" })).resolves.toBeUndefined();
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("/api/contact");
    expect(init?.method).toBe("POST");
    expect(new Headers(init?.headers).get("Content-Type")).toBe("application/json");
    expect(JSON.parse(String(init?.body))).toEqual({ name: "Ada" });
  });

  it("passes the abort signal on", async () => {
    const fetchMock = stubFetch(new Response(null, { status: 204 }));
    const signal = new AbortController().signal;
    await postJson("/contact", {}, { signal });
    expect(fetchMock.mock.calls[0]?.[1]?.signal).toBe(signal);
  });

  it.each([400, 422, 429, 502])(
    "throws ApiError with the status and detail of a %i",
    async (status) => {
      stubFetch(Response.json({ detail: "Not sent" }, { status }));
      const error = await postJson("/contact", {}).catch((caught: unknown) => caught);
      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({ status, detail: "Not sent" });
    },
  );

  it("throws ApiError without a detail when the error body is not the contract's JSON", async () => {
    stubFetch(new Response("<html>Bad gateway</html>", { status: 502 }));
    const error = await postJson("/contact", {}).catch((caught: unknown) => caught);
    expect(error).toMatchObject({ status: 502, detail: undefined });
  });
});
