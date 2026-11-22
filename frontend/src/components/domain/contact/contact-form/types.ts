import type { MessageId } from "../../../../i18n";
import type {
  CONTACT_FIELD,
  FIELD_ERROR,
  FORM_NOTICE,
  FORM_STATUS,
  HUMAN_CHECK_STATE,
} from "./config";

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
  /** Takes the `{max}`. */
  tooLong: MessageId;
  /** Takes the `{count}` and the `{max}`. */
  counter: MessageId;
  /** The notice for a refusal that names no field of the form. */
  invalid: MessageId;
  /** The notice for a request that was not sent. Read out when it shows. */
  failed: MessageId;
  /** Under it while Send is locked. Takes the `{seconds}` left. Not read out as they change. */
  retryIn: MessageId;
  /** Under it once Send is free again. */
  retryNow: MessageId;
  send: MessageId;
  sending: MessageId;
  /** Takes the `{name}`. */
  thanks: MessageId;
};

export type ContactFormProps = {
  content: ContactFormContent;
};

export type HumanCheckState = (typeof HUMAN_CHECK_STATE)[keyof typeof HUMAN_CHECK_STATE];

/** Where the human check stands: the widget's state and its solved payload. */
export type HumanCheck = {
  state: HumanCheckState;
  /** Empty until the widget has solved the challenge. */
  payload: string;
};

/** The widget's `statechange` event: `payload` is null until it is solved. */
export type HumanCheckChange = CustomEvent<{ state: HumanCheckState; payload: string | null }>;
