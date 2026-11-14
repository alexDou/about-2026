import { OfflineNote } from "../../components/domain/offline-note";
import { Heading } from "../../components/ui/heading";
import { useIntl } from "../../hooks/use-intl";
import styles from "./styles.module.css";

/** The Contact Panel's page. A shell for now: later units fill it. */
export function ContactPage() @{
  const intl = useIntl();

  <section class={styles["contact-page"]}>
    <Heading text={intl.formatMessage({ id: "board.panel.contact.title" })} />
    <OfflineNote />
  </section>;
}
