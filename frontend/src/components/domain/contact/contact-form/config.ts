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

/**
 * Stands in for the human check's solved payload until Unit 4.6 adds the ALTCHA widget; the
 * backend does not check it yet.
 */
export const HUMAN_CHECK_PENDING = "pending-unit-4.6";
