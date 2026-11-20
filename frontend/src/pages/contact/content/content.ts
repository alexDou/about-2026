import { CONTACT_PROFILE_URLS } from "./config";
import type { ContactContent, ContactProfileKind } from "./types";

const profile = (kind: ContactProfileKind) => ({
  kind,
  label: `contact.profile.${kind}.label` as const,
  url: CONTACT_PROFILE_URLS[kind],
});

/** The Contact Panel's content: which message each piece of it reads. */
export const CONTACT_CONTENT: ContactContent = {
  remote: "contact.remote",
  profiles: [profile("linkedin"), profile("xing")],
  notice: "contact.notice",
  form: {
    fields: {
      name: { label: "contact.form.name.label", requiredError: "contact.form.name.error" },
      company: {
        label: "contact.form.company.label",
        requiredError: "contact.form.company.error",
      },
      position: { label: "contact.form.position.label" },
      contact: { label: "contact.form.contact.label", hint: "contact.form.contact.hint" },
    },
    required: "contact.form.required",
    tooLong: "contact.form.tooLong",
    counter: "contact.form.counter",
    invalid: "contact.form.invalid",
    failed: "contact.form.failed",
    failedNow: "contact.form.failedNow",
    send: "contact.form.send",
    sending: "contact.form.sending",
    thanks: "contact.form.thanks",
  },
};
