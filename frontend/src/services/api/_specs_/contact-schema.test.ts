// Contract test: the zod schema accepts and rejects along the rules the backend's Pydantic model
// holds (`backend/src/app/contact/models.py`, tested in `backend/tests/contact/test_models.py`).
import { describe, expect, it } from "vitest";
import { CONTACT_LIMITS, CONTACT_STATUS } from "../config";
import { contactRequestSchema } from "../contact-schema";

const VALID = {
  name: "Ada Lovelace",
  company: "Analytical Engines",
  altcha: "eyJwYXlsb2FkIjp0cnVlfQ==",
};
const OPTIONAL = ["position", "contact", "website"] as const;
const REQUIRED = ["name", "company", "altcha"] as const;
const LIMITED = Object.entries(CONTACT_LIMITS) as [keyof typeof CONTACT_LIMITS, number][];

function parse(fields: Record<string, unknown> = {}) {
  return contactRequestSchema.safeParse({ ...VALID, ...fields });
}

/** The path and code of every issue, as the form will read them. */
function issues(fields: Record<string, unknown>) {
  const result = parse(fields);
  expect(result.success).toBe(false);
  return result.error?.issues.map((issue) => ({ path: issue.path.join("."), code: issue.code }));
}

const char = (codePoint: number) => String.fromCodePoint(codePoint);

describe("contactRequestSchema", () => {
  it("accepts name, company and altcha alone", () => {
    expect(parse().data).toEqual(VALID);
  });

  it("accepts every field", () => {
    const fields = { position: "Staff engineer", contact: "ada@example.com", website: "" };
    expect(parse(fields).data).toEqual({
      ...VALID,
      position: "Staff engineer",
      contact: "ada@example.com",
    });
  });

  it("holds the contract's limits", () => {
    expect(CONTACT_LIMITS).toEqual({ name: 80, company: 100, position: 120, contact: 200 });
  });

  it.each(LIMITED)("accepts %s at its limit", (field, limit) => {
    expect(parse({ [field]: "x".repeat(limit) }).data?.[field]).toBe("x".repeat(limit));
  });

  it.each(LIMITED)("rejects %s over its limit", (field, limit) => {
    expect(issues({ [field]: "x".repeat(limit + 1) })).toEqual([{ path: field, code: "too_big" }]);
  });

  it("counts length in code points, as the backend does", () => {
    const emoji = char(0x1f600); // one code point, two UTF-16 code units
    expect(parse({ name: emoji.repeat(80) }).success).toBe(true);
    expect(issues({ name: emoji.repeat(81) })).toEqual([{ path: "name", code: "too_big" }]);
  });

  it.each(REQUIRED)("rejects a missing %s", (field) => {
    const { [field]: _missing, ...rest } = VALID;
    const result = contactRequestSchema.safeParse(rest);
    expect(result.error?.issues.map((issue) => issue.path.join("."))).toEqual([field]);
  });

  const blanks = [
    "",
    "   ",
    "\t\n",
    char(0xa0) + char(0x3000) + char(0xfeff),
    char(0x00) + char(0x07),
  ];

  it.each(REQUIRED)("counts whitespace only as empty for the required %s", (field) => {
    for (const blank of blanks) {
      expect(issues({ [field]: blank })).toEqual([{ path: field, code: "too_small" }]);
    }
  });

  it.each(OPTIONAL)("counts whitespace only as not given for the optional %s", (field) => {
    for (const blank of [...blanks, char(0x1b)]) {
      const result = parse({ [field]: blank });
      expect(result.success).toBe(true);
      expect(result.data?.[field]).toBeUndefined();
      // Sent as JSON, the field is left out, which the backend reads as not given.
      expect(JSON.parse(JSON.stringify(result.data))).not.toHaveProperty(field);
    }
  });

  it("trims and strips control characters", () => {
    const name = `  Ada${char(0x00)} Love${char(0x7f)}lace${char(0x85)} `;
    const company = `${char(0xfeff)}Engines${char(0xa0)}`;
    expect(parse({ name, company }).data).toMatchObject({
      name: "Ada Lovelace",
      company: "Engines",
    });
  });

  it.each(["\n", "\r\n", "\r", "\t", char(0x2028), char(0x2029), char(0x85)])(
    "turns a line break or tab (%j) into a space",
    (separator) => {
      const position = `Staff${separator}engineer${separator}`;
      expect(parse({ position }).data?.position).toBe("Staff engineer");
    },
  );

  it.each(OPTIONAL)("rejects an explicit null for the optional %s", (field) => {
    expect(issues({ [field]: null })).toEqual([{ path: field, code: "invalid_type" }]);
  });

  it("applies the limits after cleaning", () => {
    const name = `${" ".repeat(10)}${"x".repeat(80)}${char(0x00).repeat(10)}`;
    expect(parse({ name }).data?.name).toBe("x".repeat(80));
  });

  it.each([42, null, ["Ada"], { first: "Ada" }])(
    "rejects a name that is not a string (%j)",
    (name) => {
      expect(issues({ name })).toEqual([{ path: "name", code: "invalid_type" }]);
    },
  );

  it("drops unknown fields", () => {
    expect(parse({ role: "admin" }).data).not.toHaveProperty("role");
  });
});

describe("CONTACT_STATUS", () => {
  it("holds the contract's status codes", () => {
    expect(CONTACT_STATUS).toEqual({
      sent: 204,
      invalidFields: 422,
      failedHumanCheck: 400,
      limitReached: 429,
      emailNotSent: 502,
    });
  });
});
