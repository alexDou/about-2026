import { Heading } from "../../components/ui/Heading";
import { useIntl } from "../../hooks/useIntl";
import styles from "./styles.module.css";

/** The About Panel's page. A shell for now: later units fill it. */
export function AboutPage() @{
  const intl = useIntl();

  <section class={styles["about-page"]}>
    <Heading text={intl.formatMessage({ id: "board.panel.about.title" })} />
  </section>;
}
