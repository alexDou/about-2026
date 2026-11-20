import { CONTACT_LIMITS, contactRequestSchema } from "../../../../services/api";
import { COUNTER_FROM, FIELD_ERROR } from "./config";
import type { ContactFieldName, FieldError } from "./types";

/** What is wrong with a field's value, by the same rules the request is checked by. */
export function fieldError(field: ContactFieldName, value: string): FieldError | undefined {
  const result = contactRequestSchema.shape[field].safeParse(value);
  if (result.success) return undefined;
  return result.error.issues[0]?.code === "too_big" ? FIELD_ERROR.tooLong : FIELD_ERROR.required;
}

/** The characters a Visitor sees in a value: code points, spaces around it not counted. */
export function characterCount(value: string): number {
  return Array.from(value.trim()).length;
}

/** Whether a field's counter shows: once the value is past its share of the limit. */
export function showsCounter(field: ContactFieldName, value: string): boolean {
  return characterCount(value) > CONTACT_LIMITS[field] * COUNTER_FROM;
}
