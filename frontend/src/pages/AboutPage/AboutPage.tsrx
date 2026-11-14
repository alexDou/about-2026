import { Heading } from "../../components/ui/Heading";
import { useIntl } from "../../hooks/useIntl";
import { AvailabilityBadges } from "./components/AvailabilityBadges";
import { ABOUT_CONTENT } from "./content";
import styles from "./styles.module.css";

/** The About Panel's page. The badge row is in; later units add the cards. */
export function AboutPage() @{
  const intl = useIntl();

  <section class={styles["about-page"]}>
    <AvailabilityBadges badges={ABOUT_CONTENT.badges} />
    <Heading text={intl.formatMessage({ id: "board.panel.about.title" })} />
  </section>;
}
