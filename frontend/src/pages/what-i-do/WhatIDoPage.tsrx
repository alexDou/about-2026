import { Heading } from "../../components/ui/heading";
import { useIntl } from "../../hooks/use-intl";
import styles from "./styles.module.css";

/** The What I do Panel's page. A shell for now: later units fill it. */
export function WhatIDoPage() @{
  const intl = useIntl();

  <section class={styles["what-i-do-page"]}>
    <Heading text={intl.formatMessage({ id: "board.panel.whatIDo.title" })} />
  </section>;
}
