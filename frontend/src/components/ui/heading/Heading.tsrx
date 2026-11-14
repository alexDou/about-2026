import styles from "./styles.module.css";
import type { HeadingProps } from "./types";

/**
 * The heading of a page. Not a tab stop, but code can focus it: opening a Panel moves focus here.
 * A page whose design opens with something else hides it from sight only (`visuallyHidden`).
 */
export function Heading({ text, visuallyHidden = false }: HeadingProps) @{
  <h1
    class={[styles["heading"], visuallyHidden && styles["heading--visually-hidden"]]}
    tabIndex={-1}
  >
    {text}
  </h1>;
}
