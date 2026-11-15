import styles from "./styles.module.css";
import type { CornerButtonProps } from "./types";

/**
 * A page corner peeled back: a 24px square whose upper-right part is a curled flap in the accent
 * red, drawn in CSS. Its parent places it in a corner; the label names it for screen readers.
 */
export function CornerButton({ label, onClick }: CornerButtonProps) @{
  <button
    type="button"
    class={styles["corner-button"]}
    title={label}
    aria-label={label}
    onClick={onClick}
  />;
}
