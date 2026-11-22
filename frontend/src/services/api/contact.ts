import { ApiError, postJson } from "./client";
import { CONTACT_FIELD_ERROR, CONTACT_OUTCOME, CONTACT_STATUS } from "./config";
import type { ContactFieldError, ContactOutcome, ContactRequest } from "./types";

const FIELD_ERRORS: readonly string[] = Object.values(CONTACT_FIELD_ERROR);

function isFieldError(value: unknown): value is ContactFieldError {
  if (typeof value !== "object" || value === null) return false;
  const { field, error } = value as Record<string, unknown>;
  return typeof field === "string" && typeof error === "string" && FIELD_ERRORS.includes(error);
}

/** The `fields` of a `422` body: the ones that follow the contract, none when it has no such list. */
function fieldErrors(body: unknown): ContactFieldError[] {
  const fields = (body as { fields?: unknown } | undefined)?.fields;
  return Array.isArray(fields) ? fields.filter(isFieldError) : [];
}

/** Sends a Contact request and says what came of it. Never throws: a failure is an outcome. */
export async function submitContact(request: ContactRequest): Promise<ContactOutcome> {
  try {
    await postJson("/contact", request);
    return { kind: CONTACT_OUTCOME.sent };
  } catch (error) {
    if (error instanceof ApiError && error.status === CONTACT_STATUS.invalidFields) {
      return { kind: CONTACT_OUTCOME.invalidFields, fields: fieldErrors(error.body) };
    }
    return { kind: CONTACT_OUTCOME.failed };
  }
}
