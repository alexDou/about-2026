import styles from "./styles.module.css";
import type { CardProps } from "./types";

/** A light card (an article, like the top card): the surface the About Panel's cards share. */
export function Card({ children }: CardProps) @{
  <article class={styles["card"]}>{children}</article>;
}
