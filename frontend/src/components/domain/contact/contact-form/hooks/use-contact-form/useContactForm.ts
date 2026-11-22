import { useState } from "octane";
import {
  CONTACT_OUTCOME,
  contactRequestSchema,
  submitContact,
} from "../../../../../../services/api";
import type { ContactFieldError } from "../../../../../../services/api";
import {
  CONTACT_FIELD,
  CONTACT_FIELDS,
  FORM_NOTICE,
  FORM_STATUS,
  HUMAN_CHECK_STATE,
} from "../../config";
import type {
  ContactFieldErrors,
  ContactFieldName,
  ContactFormValues,
  HumanCheck,
  HumanCheckChange,
} from "../../types";
import { fieldError } from "../../utils";
import { useHumanCheckWidget } from "../use-human-check-widget";
import type { ContactFormState, FocusRequest } from "./types";

const EMPTY_VALUES: ContactFormValues = {
  [CONTACT_FIELD.name]: "",
  [CONTACT_FIELD.company]: "",
  [CONTACT_FIELD.position]: "",
  [CONTACT_FIELD.contact]: "",
};

const NOT_CHECKED: HumanCheck = { state: HUMAN_CHECK_STATE.unverified, payload: "" };

/** The form's state: what is typed, what is wrong, where the form stands, and sending it. */
export function useContactForm(): ContactFormState {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [status, setStatus] = useState<ContactFormState["status"]>(FORM_STATUS.editing);
  // The fields the Visitor has typed in or left: only those show what is wrong with them.
  const [touched, setTouched] = useState<Partial<Record<ContactFieldName, true>>>({});
  // What the backend refused. A field's error goes when its value changes.
  const [refused, setRefused] = useState<ContactFieldErrors>({});
  const [notice, setNotice] = useState<ContactFormState["notice"]>(undefined);
  const [focusRequest, setFocusRequest] = useState<FocusRequest | undefined>(undefined);
  const [sentName, setSentName] = useState("");
  const [website, setWebsite] = useState("");
  const [, setHumanCheck, getHumanCheck] = useState<HumanCheck>(NOT_CHECKED);
  const [humanCheckRound, setHumanCheckRound] = useState(0);
  const [retryLocked, setRetryLocked] = useState(false);
  const humanCheckReady = useHumanCheckWidget();

  const errors: ContactFieldErrors = {};
  let valid = true;
  for (const { name } of CONTACT_FIELDS) {
    const wrong = fieldError(name, values[name]);
    if (wrong || refused[name]) valid = false;
    errors[name] = refused[name] ?? (touched[name] ? wrong : undefined);
  }

  // Whether a request may go out now; the Send button and `submit` both follow it.
  const canSend = status === FORM_STATUS.editing && !retryLocked && valid && humanCheckReady;

  /** A payload is used once: the next attempt gets a new widget and so a new challenge. */
  function renewHumanCheck() {
    setHumanCheck(NOT_CHECKED);
    setHumanCheckRound((round) => round + 1);
  }

  function failToSend() {
    setNotice(FORM_NOTICE.failed);
    setRetryLocked(true);
    renewHumanCheck();
  }

  function changeHumanCheck(event: HumanCheckChange) {
    const { state, payload } = event.detail;
    setHumanCheck({ state, payload: payload ?? "" });
    // The widget ends its solving with an error and does not submit: nothing else will tell.
    if (state === HUMAN_CHECK_STATE.error) failToSend();
  }

  function setValue(field: ContactFieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setTouched((current) => ({ ...current, [field]: true }));
    setRefused((current) => ({ ...current, [field]: undefined }));
    if (notice === FORM_NOTICE.invalidFields) setNotice(undefined);
  }

  function leaveField(field: ContactFieldName) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  /** The backend refused these fields: show each under its field and focus the first. A refusal
   * that names no field of the form gets a notice, so the Visitor is told something. */
  function refuseFields(fields: ContactFieldError[]) {
    const found: ContactFieldErrors = {};
    for (const { field, error } of fields) {
      const known = CONTACT_FIELDS.find(({ name }) => name === field);
      if (known) found[known.name] = error;
    }
    const first = CONTACT_FIELDS.find(({ name }) => found[name] !== undefined);
    setRefused(found);
    setNotice(first ? undefined : FORM_NOTICE.invalidFields);
    if (first) setFocusRequest({ field: first.name });
    renewHumanCheck();
  }

  async function submit(event: Event) {
    event.preventDefault();
    if (!canSend) return;
    // The widget takes the first submit, solves, and submits again. Until then there is nothing to send.
    const humanCheck = getHumanCheck();
    if (humanCheck.state === HUMAN_CHECK_STATE.verifying) return;
    const request = contactRequestSchema.safeParse({
      ...values,
      website,
      altcha: humanCheck.payload,
    });
    if (!request.success) {
      // No payload: the widget did not take the submit.
      failToSend();
      return;
    }
    setNotice(undefined);
    setStatus(FORM_STATUS.sending);
    const outcome = await submitContact(request.data);
    if (outcome.kind === CONTACT_OUTCOME.sent) {
      setSentName(request.data.name);
      setStatus(FORM_STATUS.sent);
      return;
    }
    if (outcome.kind === CONTACT_OUTCOME.invalidFields) refuseFields(outcome.fields);
    else failToSend();
    setStatus(FORM_STATUS.editing);
  }

  return {
    values,
    status,
    errors,
    notice,
    canSend,
    retryLocked,
    endRetryLock: () => setRetryLocked(false),
    focusRequest,
    sentName,
    website,
    humanCheckRound,
    setValue,
    setWebsite,
    changeHumanCheck,
    leaveField,
    submit,
  };
}
