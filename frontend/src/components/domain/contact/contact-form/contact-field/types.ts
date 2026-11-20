export type ContactFieldProps = {
  /** The field's name in the Contact request. */
  name: string;
  label: string;
  /** Shown under the field and read with it. */
  hint?: string;
  required: boolean;
  autoComplete: string;
  value: string;
  onValueInput: (value: string) => void;
};
