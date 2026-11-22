import { afterEach, describe, expect, it, vi } from "vitest";
import { CONTACT_OUTCOME } from "../config";
import { submitContact } from "../contact";
import type { ContactRequest } from "../types";

afterEach(() => vi.unstubAllGlobals());

const request: ContactRequest = {
  name: "Ada Lovelace",
  company: "Analytical Engines",
  position: "Staff engineer",
  altcha: "payload",
};

function stubFetch(response: Response | Error) {
  const fetchMock = vi.fn<typeof fetch>();
  if (response instanceof Error) fetchMock.mockRejectedValue(response);
  else fetchMock.mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("submitContact", () => {
  it("posts the request as JSON to /api/contact", async () => {
    const fetchMock = stubFetch(new Response(null, { status: 204 }));
    await submitContact(request);
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("/api/contact");
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body))).toEqual(request);
  });

  it("leaves a field that was not given out of the body", async () => {
    const fetchMock = stubFetch(new Response(null, { status: 204 }));
    await submitContact(request);
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body)) as object;
    expect(Object.keys(body)).not.toContain("contact");
  });

  it("maps 204 to sent", async () => {
    stubFetch(new Response(null, { status: 204 }));
    await expect(submitContact(request)).resolves.toEqual({ kind: CONTACT_OUTCOME.sent });
  });

  it("maps 422 to the invalid fields the backend names", async () => {
    stubFetch(
      Response.json(
        {
          detail: "Invalid fields",
          fields: [
            { field: "name", error: "required" },
            { field: "company", error: "tooLong" },
          ],
        },
        { status: 422 },
      ),
    );
    await expect(submitContact(request)).resolves.toEqual({
      kind: CONTACT_OUTCOME.invalidFields,
      fields: [
        { field: "name", error: "required" },
        { field: "company", error: "tooLong" },
      ],
    });
  });

  it("keeps only the field errors that follow the contract", async () => {
    stubFetch(
      Response.json(
        {
          detail: "Invalid fields",
          fields: [{ field: "name", error: "weird" }, { field: 7, error: "required" }, null, "x"],
        },
        { status: 422 },
      ),
    );
    await expect(submitContact(request)).resolves.toEqual({
      kind: CONTACT_OUTCOME.invalidFields,
      fields: [],
    });
  });

  it("maps a 422 without a field list to invalid fields with none", async () => {
    stubFetch(new Response("<html>", { status: 422 }));
    await expect(submitContact(request)).resolves.toEqual({
      kind: CONTACT_OUTCOME.invalidFields,
      fields: [],
    });
  });

  it.each([400, 429, 502, 500])("maps %i to failed", async (status) => {
    stubFetch(Response.json({ detail: "no" }, { status }));
    await expect(submitContact(request)).resolves.toEqual({ kind: CONTACT_OUTCOME.failed });
  });

  it("maps a network failure to failed", async () => {
    stubFetch(new TypeError("network"));
    await expect(submitContact(request)).resolves.toEqual({ kind: CONTACT_OUTCOME.failed });
  });
});
