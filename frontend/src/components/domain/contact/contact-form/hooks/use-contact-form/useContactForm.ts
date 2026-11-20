import { useState } from "octane";
import {
  CONTACT_OUTCOME,
  contactRequestSchema,
  submitContact,
} from "../../../../../../services/api";
import {
  CONTACT_FIELD,
  CONTACT_FIELDS,
  FORM_NOTICE,
  FORM_STATUS,
  HUMAN_CHECK_PENDING,
} from "../../config";
import type { ContactFieldErrors, ContactFieldName, ContactFormValues } from "../../types";
import { fieldError } from "../../utils";
import type { ContactFormState, FocusRequest } from "./types";

const EMPTY_VALUES: ContactFormValues = {
  [CONTACT_FIELD.name]: "",
  [CONTACT_FIELD.company]: "",
  [CONTACT_FIELD.position]: "",
  [CONTACT_FIELD.contact]: "",
};

/** The form's state: what is typed, what is wrong, where the form stands, and sending it. */
export function useContactForm(): ContactFormState {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [status, setStatus] = useState<ContactFormState["status"]>(FORM_STATUS.editing);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [notice, setNotice] = useState<ContactFormState["notice"]>(undefined);
  const [focusRequest, setFocusRequest] = useState<FocusRequest | undefined>(undefined);
  const [sentName, setSentName] = useState("");

  function setValue(field: ContactFieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function leaveField(field: ContactFieldName) {
    setErrors((current) => ({ ...current, [field]: fieldError(field, values[field]) }));
  }

  async function submit(event: Event) {
    event.preventDefault();
    if (status !== FORM_STATUS.editing) return;
    const found: ContactFieldErrors = {};
    for (const { name } of CONTACT_FIELDS) found[name] = fieldError(name, values[name]);
    setErrors(found);
    const firstInvalid = CONTACT_FIELDS.find(({ name }) => found[name] !== undefined);
    if (firstInvalid) {
      setFocusRequest({ field: firstInvalid.name });
      return;
    }
    const request = contactRequestSchema.safeParse({ ...values, altcha: HUMAN_CHECK_PENDING });
    if (!request.success) return;
    setNotice(undefined);
    setStatus(FORM_STATUS.sending);
    const outcome = await submitContact(request.data);
    if (outcome === CONTACT_OUTCOME.sent) {
      setSentName(request.data.name);
      setStatus(FORM_STATUS.sent);
      return;
    }
    if (outcome === CONTACT_OUTCOME.invalidFields) setNotice(FORM_NOTICE.invalidFields);
    setStatus(FORM_STATUS.editing);
  }

  return { values, status, errors, notice, focusRequest, sentName, setValue, leaveField, submit };
}
