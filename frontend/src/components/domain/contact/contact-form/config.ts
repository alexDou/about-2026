/** The form's fields, by the name they have in the Contact request. */
export const CONTACT_FIELD = {
  name: "name",
  company: "company",
  position: "position",
  contact: "contact",
} as const;

/** The fields in the order they show, with what a browser needs to know about each. */
export const CONTACT_FIELDS = [
  { name: CONTACT_FIELD.name, required: true, autoComplete: "name" },
  { name: CONTACT_FIELD.company, required: true, autoComplete: "organization" },
  { name: CONTACT_FIELD.position, required: false, autoComplete: "organization-title" },
  { name: CONTACT_FIELD.contact, required: false, autoComplete: "off" },
] as const;

/** Where the form stands. Failures come back to `editing`, with the typed values kept. */
export const FORM_STATUS = {
  editing: "editing",
  sending: "sending",
  sent: "sent",
} as const;

/** The ALTCHA widget's states (its `State`); its `statechange` events carry them. */
export const HUMAN_CHECK_STATE = {
  unverified: "unverified",
  verifying: "verifying",
  verified: "verified",
  error: "error",
  expired: "expired",
  code: "code",
} as const;

/** The widget solves the challenge when the form is submitted, and shows nothing of it. */
export const HUMAN_CHECK_WIDGET = { auto: "onsubmit", display: "invisible" } as const;

/** What can be wrong with a field. */
export const FIELD_ERROR = {
  required: "required",
  tooLong: "tooLong",
} as const;

/** The counter shows once a field holds more than this share of its limit. */
export const COUNTER_FROM = 0.8;

/** What the form tells the Visitor about the last attempt, above the Send button. */
export const FORM_NOTICE = {
  invalidFields: "invalidFields",
  failed: "failed",
} as const;

/** After a request fails, Send stays locked this many seconds. */
export const RETRY_SECONDS = 10;
