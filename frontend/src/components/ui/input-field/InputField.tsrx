import { useId } from "octane";
import { INPUT_FIELD_LAYOUTS, INPUT_FIELD_TONES } from "./config";
import styles from "./styles.module.css";
import type { InputFieldProps } from "./types";

/**
 * A labelled text field: the label above or beside it, the asterisk when required, then the hint,
 * the error and the counter under it. The hint and the error are read with the field. `layout` and
 * `tone` set its look.
 */
export function InputField({
  name,
  label,
  hint,
  error,
  counter,
  required,
  autoComplete,
  value,
  layout = INPUT_FIELD_LAYOUTS.stacked,
  tone = INPUT_FIELD_TONES.light,
  onValueInput,
  onLeave,
  inputRef,
}: InputFieldProps) @{
  const inputId = useId();
  const hintId = useId();
  const errorId = useId();
  const describedBy = [hint ? hintId : undefined, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  <div
    class={[
      styles["input-field"],
      styles[`input-field--${layout}`],
      styles[`input-field--${tone}`],
    ]}
  >
    <label class={styles["input-field__label"]} for={inputId}>
      {label}
      @if (required) {
        <span aria-hidden="true">{" *"}</span>;
      }
    </label>
    <input
      id={inputId}
      class={styles["input-field__input"]}
      ref={inputRef}
      type="text"
      name={name}
      value={value}
      required={required}
      autoComplete={autoComplete}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={describedBy || undefined}
      onInput={(event) => onValueInput((event.target as HTMLInputElement).value)}
      onBlur={onLeave}
    />
    @if (hint) {
      <span id={hintId} class={styles["input-field__hint"]}>
        {hint}
      </span>;
    }
    @if (error) {
      <span id={errorId} class={styles["input-field__error"]}>
        {error}
      </span>;
    }
    @if (counter) {
      <span class={styles["input-field__counter"]}>{counter}</span>;
    }
  </div>;
}
