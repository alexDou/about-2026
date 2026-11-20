import { useId } from "octane";
import styles from "./styles.module.css";
import type { ContactFieldProps } from "./types";

/**
 * A labelled text field: the label above it, the asterisk when required, then the hint, the error
 * and the counter under it. The hint and the error are read with the field.
 */
export function ContactField({
  name,
  label,
  hint,
  error,
  counter,
  required,
  autoComplete,
  value,
  onValueInput,
  onLeave,
  inputRef,
}: ContactFieldProps) @{
  const inputId = useId();
  const hintId = useId();
  const errorId = useId();
  const describedBy = [hint ? hintId : undefined, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  <div class={styles["contact-field"]}>
    <label class={styles["contact-field__label"]} for={inputId}>
      {label}
      @if (required) {
        <span aria-hidden="true">{" *"}</span>;
      }
    </label>
    <input
      id={inputId}
      class={styles["contact-field__input"]}
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
      <span id={hintId} class={styles["contact-field__hint"]}>
        {hint}
      </span>;
    }
    @if (error) {
      <span id={errorId} class={styles["contact-field__error"]}>
        {error}
      </span>;
    }
    @if (counter) {
      <span class={styles["contact-field__counter"]}>{counter}</span>;
    }
  </div>;
}
