import type { ContactFieldName, ContactFormValues, FormStatus } from "../../types";

export type ContactFormState = {
  values: ContactFormValues;
  status: FormStatus;
  /** The name the Visitor gave, once the request is sent. */
  sentName: string;
  setValue: (field: ContactFieldName, value: string) => void;
  submit: (event: Event) => Promise<void>;
};
