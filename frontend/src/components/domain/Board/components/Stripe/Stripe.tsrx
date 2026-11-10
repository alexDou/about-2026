import styles from "./styles.module.css";
import type { StripeProps } from "./types";

/** A Panel squeezed to the Board's edge while another is expanded: its title as one big link. */
export function Stripe({ title, href, onClick }: StripeProps) @{
  <div class={styles["stripe"]}>
    <a class={styles["link"]} href={href} onClick={onClick}>
      {title}
    </a>
  </div>;
}
