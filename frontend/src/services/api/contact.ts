import { ApiError, postJson } from "./client";
import { CONTACT_OUTCOME, CONTACT_STATUS } from "./config";
import type { ContactOutcome, ContactRequest } from "./types";

/** Sends a Contact request and says what came of it. Never throws: a failure is an outcome. */
export async function submitContact(request: ContactRequest): Promise<ContactOutcome> {
  try {
    await postJson("/contact", request);
    return CONTACT_OUTCOME.sent;
  } catch (error) {
    if (error instanceof ApiError && error.status === CONTACT_STATUS.invalidFields) {
      return CONTACT_OUTCOME.invalidFields;
    }
    return CONTACT_OUTCOME.failed;
  }
}
