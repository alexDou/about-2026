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
  HUMAN_CHECK_STATE,
  RETRY_SECONDS,
} from "../../config";
import type {
  ContactFieldErrors,
  ContactFieldName,
  ContactFormValues,
  HumanCheck,
  HumanCheckChange,
} from "../../types";
import { fieldError } from "../../utils";
import { useCountdown } from "../use-countdown";
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
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [notice, setNotice] = useState<ContactFormState["notice"]>(undefined);
  const [focusRequest, setFocusRequest] = useState<FocusRequest | undefined>(undefined);
  const [sentName, setSentName] = useState("");
  const [website, setWebsite] = useState("");
  const [, setHumanCheck, getHumanCheck] = useState<HumanCheck>(NOT_CHECKED);
  const [humanCheckRound, setHumanCheckRound] = useState(0);
  const retry = useCountdown();

  /** A payload is used once: the next attempt gets a new widget and so a new challenge. */
  function renewHumanCheck() {
    setHumanCheck(NOT_CHECKED);
    setHumanCheckRound((round) => round + 1);
  }

  function failToSend() {
    setNotice(FORM_NOTICE.failed);
    retry.start(RETRY_SECONDS);
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
  }

  function leaveField(field: ContactFieldName) {
    setErrors((current) => ({ ...current, [field]: fieldError(field, values[field]) }));
  }

  async function submit(event: Event) {
    event.preventDefault();
    if (status !== FORM_STATUS.editing || retry.remaining > 0) return;
    // The widget takes the first submit, solves, and submits again. Until then there is nothing to send.
    const humanCheck = getHumanCheck();
    if (humanCheck.state === HUMAN_CHECK_STATE.verifying) return;
    const found: ContactFieldErrors = {};
    for (const { name } of CONTACT_FIELDS) found[name] = fieldError(name, values[name]);
    setErrors(found);
    const firstInvalid = CONTACT_FIELDS.find(({ name }) => found[name] !== undefined);
    if (firstInvalid) {
      setFocusRequest({ field: firstInvalid.name });
      renewHumanCheck();
      return;
    }
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
    if (outcome === CONTACT_OUTCOME.sent) {
      setSentName(request.data.name);
      setStatus(FORM_STATUS.sent);
      return;
    }
    if (outcome === CONTACT_OUTCOME.invalidFields) {
      setNotice(FORM_NOTICE.invalidFields);
      renewHumanCheck();
    } else {
      failToSend();
    }
    setStatus(FORM_STATUS.editing);
  }

  return {
    values,
    status,
    errors,
    notice,
    retryIn: retry.remaining,
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
