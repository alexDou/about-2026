import { describe, expect, it } from "vitest";
import { FIELD_ERROR } from "../config";
import { characterCount, fieldError, showsCounter } from "../utils";

describe("fieldError", () => {
  it("asks for a required field that is empty or only spaces", () => {
    expect(fieldError("name", "")).toBe(FIELD_ERROR.required);
    expect(fieldError("company", " \n\t ")).toBe(FIELD_ERROR.required);
  });

  it("accepts a required field with spaces around its value", () => {
    expect(fieldError("name", "  Ada  ")).toBeUndefined();
  });

  it("leaves an optional field free to be empty", () => {
    expect(fieldError("position", "")).toBeUndefined();
    expect(fieldError("contact", "   ")).toBeUndefined();
  });

  it("flags a value past its limit, whichever field it is", () => {
    expect(fieldError("name", "x".repeat(81))).toBe(FIELD_ERROR.tooLong);
    expect(fieldError("name", "x".repeat(80))).toBeUndefined();
    expect(fieldError("contact", "x".repeat(201))).toBe(FIELD_ERROR.tooLong);
  });
});

describe("characterCount", () => {
  it("counts code points, not spaces around the value", () => {
    expect(characterCount("  😀😀  ")).toBe(2);
  });
});

describe("showsCounter", () => {
  it("shows only past 80% of the field's limit", () => {
    expect(showsCounter("name", "x".repeat(64))).toBe(false);
    expect(showsCounter("name", "x".repeat(65))).toBe(true);
    expect(showsCounter("contact", "x".repeat(160))).toBe(false);
    expect(showsCounter("contact", "x".repeat(161))).toBe(true);
  });
});
