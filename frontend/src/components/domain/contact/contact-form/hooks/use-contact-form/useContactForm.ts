import { useState } from "octane";
import {
  CONTACT_OUTCOME,
  contactRequestSchema,
  submitContact,
} from "../../../../../../services/api";
import { CONTACT_FIELD, FORM_STATUS, HUMAN_CHECK_PENDING } from "../../config";
import type { ContactFieldName, ContactFormValues } from "../../types";
import type { ContactFormState } from "./types";

const EMPTY_VALUES: ContactFormValues = {
  [CONTACT_FIELD.name]: "",
  [CONTACT_FIELD.company]: "",
  [CONTACT_FIELD.position]: "",
  [CONTACT_FIELD.contact]: "",
};

/** The form's state: what is typed, where the form stands, and sending it. */
export function useContactForm(): ContactFormState {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [status, setStatus] = useState<ContactFormState["status"]>(FORM_STATUS.editing);
  const [sentName, setSentName] = useState("");

  function setValue(field: ContactFieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: Event) {
    event.preventDefault();
    if (status !== FORM_STATUS.editing) return;
    const request = contactRequestSchema.safeParse({ ...values, altcha: HUMAN_CHECK_PENDING });
    if (!request.success) return;
    setStatus(FORM_STATUS.sending);
    const outcome = await submitContact(request.data);
    if (outcome === CONTACT_OUTCOME.sent) {
      setSentName(request.data.name);
      setStatus(FORM_STATUS.sent);
    } else {
      setStatus(FORM_STATUS.editing);
    }
  }

  return { values, status, sentName, setValue, submit };
}
