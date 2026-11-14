import { Heading } from "../../components/ui/heading";
import { useIntl } from "../../hooks/use-intl";
import { AboutStatusBadges } from "../../components/domain/about/about-status-badges";
import { ABOUT_CONTENT } from "./content";
import styles from "./styles.module.css";

/** The About Panel's page. The badge row is in; later units add the cards. */
export function AboutPage() @{
  const intl = useIntl();

  <section class={styles["about-page"]}>
    <AboutStatusBadges badges={ABOUT_CONTENT.badges} />
    <Heading text={intl.formatMessage({ id: "board.panel.about.title" })} />
  </section>;
}
