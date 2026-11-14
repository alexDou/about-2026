import { OfflineNote } from "../../components/domain/offline-note";
import { Heading } from "../../components/ui/heading";
import { useIntl } from "../../hooks/use-intl";
import styles from "./styles.module.css";

/** The Chat with me Panel's page. A shell for now: later units fill it. */
export function ChatWithMePage() @{
  const intl = useIntl();

  <section class={styles["chat-with-me-page"]}>
    <Heading text={intl.formatMessage({ id: "board.panel.chatWithMe.title" })} />
    <OfflineNote />
  </section>;
}
