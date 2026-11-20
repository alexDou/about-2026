export type ContactFieldProps = {
  /** The field's name in the Contact request. */
  name: string;
  label: string;
  /** Shown under the field and read with it. */
  hint?: string;
  /** What is wrong with the value, shown under the field and read with it. */
  error?: string;
  /** "n / max", once the value nears its limit. */
  counter?: string;
  required: boolean;
  autoComplete: string;
  value: string;
  onValueInput: (value: string) => void;
  onLeave: () => void;
  /** Gets the input element when it mounts, and null when it goes. */
  inputRef: (input: HTMLInputElement | null) => void;
};
