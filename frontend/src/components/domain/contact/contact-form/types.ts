import type { MessageId } from "../../../../i18n";
import type { CONTACT_FIELD, FORM_STATUS } from "./config";

export type ContactFieldName = (typeof CONTACT_FIELD)[keyof typeof CONTACT_FIELD];

export type FormStatus = (typeof FORM_STATUS)[keyof typeof FORM_STATUS];

/** What the Visitor has typed, as typed. */
export type ContactFormValues = Record<ContactFieldName, string>;

/** A field's label, and the hint under it when it has one, as message ids. */
export type ContactFieldContent = {
  label: MessageId;
  hint?: MessageId;
};

/** What the form says, as message ids. */
export type ContactFormContent = {
  fields: Record<ContactFieldName, ContactFieldContent>;
  /** The line that explains the asterisk. */
  required: MessageId;
  send: MessageId;
  sending: MessageId;
  /** Takes the `{name}`. */
  thanks: MessageId;
};

export type ContactFormProps = {
  content: ContactFormContent;
};
