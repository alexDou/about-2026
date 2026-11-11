import { OfflineNote } from "../../components/domain/OfflineNote";
import { Heading } from "../../components/ui/Heading";
import { useIntl } from "../../hooks/useIntl";
import styles from "./styles.module.css";

/** The Contact Panel's page. A shell for now: later units fill it. */
export function ContactPage() @{
  const intl = useIntl();

  <section class={styles["contact-page"]}>
    <Heading text={intl.formatMessage({ id: "board.panel.contact.title" })} />
    <OfflineNote />
  </section>;
}
