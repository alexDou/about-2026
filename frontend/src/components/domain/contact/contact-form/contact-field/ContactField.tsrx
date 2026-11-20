import { useId } from "octane";
import styles from "./styles.module.css";
import type { ContactFieldProps } from "./types";

/** A labelled text field: the label above it, the asterisk when required, the hint under it. */
export function ContactField({
  name,
  label,
  hint,
  required,
  autoComplete,
  value,
  onValueInput,
}: ContactFieldProps) @{
  const hintId = useId();

  <label class={styles["contact-field"]}>
    <span class={styles["contact-field__label"]}>
      {label}
      @if (required) {
        <span aria-hidden="true">{" *"}</span>;
      }
    </span>
    <input
      class={styles["contact-field__input"]}
      type="text"
      name={name}
      value={value}
      required={required}
      autoComplete={autoComplete}
      aria-describedby={hint ? hintId : undefined}
      onInput={(event) => onValueInput((event.target as HTMLInputElement).value)}
    />
    @if (hint) {
      <span id={hintId} class={styles["contact-field__hint"]}>
        {hint}
      </span>;
    }
  </label>;
}
