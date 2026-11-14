import styles from "./styles.module.css";
import type { CardHeadingProps } from "./types";

/** The heading of a card or of a column in one, in Playfair Display. */
export function CardHeading({ text }: CardHeadingProps) @{
  <h2 class={styles["card-heading"]}>{text}</h2>;
}
