import cx from "classnames";
import styles from "./styles.module.css";
import type { StripeProps } from "./types";

/** A Panel squeezed to the Board's edge while another is expanded: its title as one big link. */
export function Stripe({ tone, title, href, onClick }: StripeProps) @{
  <li class={cx(styles["stripe"], styles[tone])}>
    <a class={styles["link"]} href={href} onClick={onClick}>
      {title}
    </a>
  </li>;
}
