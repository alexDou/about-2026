import type {
  ContactFieldErrors,
  ContactFieldName,
  ContactFormValues,
  FormNotice,
  FormStatus,
  HumanCheckChange,
} from "../../types";

/** The field to focus after the backend refused a field. A new object each time. */
export type FocusRequest = { field: ContactFieldName };

export type ContactFormState = {
  values: ContactFormValues;
  status: FormStatus;
  errors: ContactFieldErrors;
  notice: FormNotice | undefined;
  /** Every field passes its rules and the backend has no complaint left: Send may work. */
  valid: boolean;
  /** Send is locked after a failed attempt, until the countdown ends. */
  retryLocked: boolean;
  /** The countdown ended. */
  endRetryLock: () => void;
  focusRequest: FocusRequest | undefined;
  /** The name the Visitor gave, once the request is sent. */
  sentName: string;
  /** What a bot put in the hidden honeypot field; a Visitor never reaches it. */
  website: string;
  /** The ALTCHA widget has loaded: before that, nothing can be sent. */
  humanCheckReady: boolean;
  /** Changes with each new human check: a widget that has been used is replaced, not reused. */
  humanCheckRound: number;
  setValue: (field: ContactFieldName, value: string) => void;
  setWebsite: (value: string) => void;
  /** The widget's state changed. */
  changeHumanCheck: (event: HumanCheckChange) => void;
  /** A field lost focus: from now on it shows what is wrong with it. */
  leaveField: (field: ContactFieldName) => void;
  submit: (event: Event) => Promise<void>;
};
