import styles from "./styles.module.css";
import type { SublabelProps } from "./types";

/** The short line under a Panel's title. Plain text: only the title is clickable. */
export function Sublabel({ text }: SublabelProps) @{
  <p class={styles["sublabel"]}>{text}</p>;
}
