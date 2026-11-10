import styles from "./styles.module.css";
import type { HeadingProps } from "./types";

/**
 * The heading of a page. Not a tab stop, but code can focus it: opening a Panel moves focus here.
 */
export function Heading({ text }: HeadingProps) @{
  <h1 class={styles["heading"]} tabIndex={-1}>
    {text}
  </h1>;
}
