import { Heading } from "../../components/ui/Heading";
import { useIntl } from "../../hooks/useIntl";
import styles from "./styles.module.css";

/** The Chat with me Panel's page. A shell for now: later units fill it. */
export function ChatWithMePage() @{
  const intl = useIntl();

  <section class={styles["page"]}>
    <Heading text={intl.formatMessage({ id: "board.panel.chatWithMe.title" })} />
  </section>;
}
