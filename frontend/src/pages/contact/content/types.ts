import type { MessageId } from "../../../i18n";
import type { CONTACT_PROFILE_URLS } from "./config";

export type ContactProfileKind = keyof typeof CONTACT_PROFILE_URLS;

/** A profile elsewhere: the name its link is read by, and its address. */
export type ContactProfile = {
  kind: ContactProfileKind;
  label: MessageId;
  url: string;
};

export type ContactFormFieldKind = "name" | "company" | "position" | "contact";

/** A form field's label, and its hint when it has one. */
export type ContactFormField = {
  label: MessageId;
  hint?: MessageId;
  requiredError?: MessageId;
};

/** What the form says: the labels of its fields and its buttons' texts. */
export type ContactFormMessages = {
  fields: Record<ContactFormFieldKind, ContactFormField>;
  required: MessageId;
  tooLong: MessageId;
  counter: MessageId;
  invalid: MessageId;
  send: MessageId;
  sending: MessageId;
  thanks: MessageId;
};

/** What the Contact page says: which message each piece of it reads. */
export type ContactContent = {
  remote: MessageId;
  profiles: readonly ContactProfile[];
  notice: MessageId;
  form: ContactFormMessages;
};
