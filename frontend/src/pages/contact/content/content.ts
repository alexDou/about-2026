import { CONTACT_PROFILE_URLS } from "./config";
import type { ContactContent, ContactProfileKind } from "./types";

const profile = (kind: ContactProfileKind) => ({
  kind,
  label: `contact.profile.${kind}.label` as const,
  url: CONTACT_PROFILE_URLS[kind],
});

/** The Contact Panel's content: which message each piece of it reads. */
export const CONTACT_CONTENT: ContactContent = {
  title: "contact.page.title",
  subtitle: "contact.page.subtitle",
  remote: "contact.remote",
  profiles: [profile("linkedin"), profile("xing")],
  notice: "contact.notice",
  required: "contact.required",
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
    tooLong: "contact.form.tooLong",
    counter: "contact.form.counter",
    invalid: "contact.form.invalid",
    failed: "contact.form.failed",
    widgetFailed: "contact.form.widgetFailed",
    retryIn: "contact.form.retryIn",
    retryNow: "contact.form.retryNow",
    send: "contact.form.send",
    sending: "contact.form.sending",
    thanks: "contact.form.thanks",
  },
};
