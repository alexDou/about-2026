import type {
  ContactFieldErrors,
  ContactFieldName,
  ContactFormValues,
  FormNotice,
  FormStatus,
} from "../../types";

/** The field to focus after a failed attempt to send. A new object each attempt. */
export type FocusRequest = { field: ContactFieldName };

export type ContactFormState = {
  values: ContactFormValues;
  status: FormStatus;
  errors: ContactFieldErrors;
  notice: FormNotice | undefined;
  /** Whole seconds before Send works again after a failure; 0 when it is free. */
  retryIn: number;
  focusRequest: FocusRequest | undefined;
  /** The name the Visitor gave, once the request is sent. */
  sentName: string;
  setValue: (field: ContactFieldName, value: string) => void;
  /** A field lost focus: check it. */
  leaveField: (field: ContactFieldName) => void;
  submit: (event: Event) => Promise<void>;
};
