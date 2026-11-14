import { Heading } from "../../components/ui/heading";
import { useIntl } from "../../hooks/use-intl";
import styles from "./styles.module.css";

/** The Skills Panel's page. A shell for now: later units fill it. */
export function SkillsPage() @{
  const intl = useIntl();

  <section class={styles["skills-page"]}>
    <Heading text={intl.formatMessage({ id: "board.panel.skills.title" })} />
  </section>;
}
