import type { MessageId } from "../../../../i18n";
import type { CONTACT_FIELD, FIELD_ERROR, FORM_NOTICE, FORM_STATUS } from "./config";

export type ContactFieldName = (typeof CONTACT_FIELD)[keyof typeof CONTACT_FIELD];

export type FormStatus = (typeof FORM_STATUS)[keyof typeof FORM_STATUS];

export type FieldError = (typeof FIELD_ERROR)[keyof typeof FIELD_ERROR];

export type FormNotice = (typeof FORM_NOTICE)[keyof typeof FORM_NOTICE];

/** The fields found wrong, each with what is wrong. */
export type ContactFieldErrors = Partial<Record<ContactFieldName, FieldError>>;

/** What the Visitor has typed, as typed. */
export type ContactFormValues = Record<ContactFieldName, string>;

/** A field's label, and the hint under it when it has one, as message ids. */
export type ContactFieldContent = {
  label: MessageId;
  hint?: MessageId;
  /** What a required field says when it is empty. */
  requiredError?: MessageId;
};

/** What the form says, as message ids. */
export type ContactFormContent = {
  fields: Record<ContactFieldName, ContactFieldContent>;
  /** The line that explains the asterisk. */
  required: MessageId;
  /** Takes the `{max}`. */
  tooLong: MessageId;
  /** Takes the `{count}` and the `{max}`. */
  counter: MessageId;
  /** The notice for a request the backend refused as invalid. */
  invalid: MessageId;
  /** The notice for a request that was not sent. Takes the `{seconds}` left before a retry. */
  failed: MessageId;
  /** The same, once the countdown is over. */
  failedNow: MessageId;
  send: MessageId;
  sending: MessageId;
  /** Takes the `{name}`. */
  thanks: MessageId;
};

export type ContactFormProps = {
  content: ContactFormContent;
};
