import type { INPUT_FIELD_LAYOUTS, INPUT_FIELD_TONES } from "./config";

export type InputFieldLayout = (typeof INPUT_FIELD_LAYOUTS)[keyof typeof INPUT_FIELD_LAYOUTS];

export type InputFieldTone = (typeof INPUT_FIELD_TONES)[keyof typeof INPUT_FIELD_TONES];

export type InputFieldProps = {
  /** The field's name in the request it belongs to. */
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
  /** Defaults to the label above its input. */
  layout?: InputFieldLayout;
  /** Defaults to the light fill. */
  tone?: InputFieldTone;
  onValueInput: (value: string) => void;
  onLeave: () => void;
  /** Gets the input element when it mounts, and null when it goes. */
  inputRef: (input: HTMLInputElement | null) => void;
};
