import { Heading } from "../../components/ui/heading";
import { useIntl } from "../../hooks/use-intl";
import { AboutStatusBadges } from "../../components/domain/about/about-status-badges";
import { AboutTopCard, type AboutTopCardMedia } from "../../components/domain/about/about-top-card";
import { ABOUT_CONTENT } from "./content";
import brush from "./media/brush.svg";
import photo400Avif from "./media/me-400.avif";
import photo400Webp from "./media/me-400.webp";
import photo800Avif from "./media/me-800.avif";
import photo800Webp from "./media/me-800.webp";
import styles from "./styles.module.css";

/** The top card's media: the photo is 400 and 800 px wide, 1079:1457 like its source. */
const TOP_CARD_MEDIA: AboutTopCardMedia = {
  photo: {
    avif: [
      { url: photo400Avif, width: 400 },
      { url: photo800Avif, width: 800 },
    ],
    webp: [
      { url: photo400Webp, width: 400 },
      { url: photo800Webp, width: 800 },
    ],
    width: 400,
    height: 540,
  },
  brush,
};

/** The About Panel's page: the badge row and the top card; later units add the other cards. */
export function AboutPage() @{
  const intl = useIntl();

  <section class={styles["about-page"]}>
    // Read, not seen: the badges and the card open the page, as in the reference.
    <Heading text={intl.formatMessage({ id: "board.panel.about.title" })} visuallyHidden />
    <AboutStatusBadges badges={ABOUT_CONTENT.badges} />
    <AboutTopCard content={ABOUT_CONTENT} media={TOP_CARD_MEDIA} />
  </section>;
}
