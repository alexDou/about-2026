import { Heading } from "../../components/ui/heading";
import { useIntl } from "../../hooks/use-intl";
import { AboutStatusBadges } from "../../components/domain/about/about-status-badges";
import { AboutBioCard } from "../../components/domain/about/about-bio-card";
import { AboutEducationCard } from "../../components/domain/about/about-education-card";
import { AboutLanguagesHobbiesCard } from "../../components/domain/about/about-languages-hobbies-card";
import { AboutRolesCard } from "../../components/domain/about/about-roles-card";
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

/** The About Panel's page: the badge row, the top card, then the lower cards. */
export function AboutPage() @{
  const intl = useIntl();

  <section class={styles["about-page"]}>
    // Read, not seen: the badges and the card open the page, as in the reference.
    <Heading text={intl.formatMessage({ id: "board.panel.about.title" })} visuallyHidden />
    <AboutStatusBadges badges={ABOUT_CONTENT.badges} />
    <AboutTopCard content={ABOUT_CONTENT} media={TOP_CARD_MEDIA} />
    <div class={styles["about-page__cards"]}>
      <AboutBioCard heading={ABOUT_CONTENT.headings.bio} bio={ABOUT_CONTENT.bio} />
      <AboutRolesCard
        heading={ABOUT_CONTENT.headings.roles}
        technologiesLabel={ABOUT_CONTENT.technologiesLabel}
        roleLine={ABOUT_CONTENT.roleLine}
        roles={ABOUT_CONTENT.roles}
      />
      <AboutEducationCard
        heading={ABOUT_CONTENT.headings.education}
        education={ABOUT_CONTENT.education}
      />
      <AboutLanguagesHobbiesCard
        headings={{
          languages: ABOUT_CONTENT.headings.languages,
          hobbies: ABOUT_CONTENT.headings.hobbies,
        }}
        languageLines={ABOUT_CONTENT.languageLines}
        languages={ABOUT_CONTENT.languages}
        hobbies={ABOUT_CONTENT.hobbies}
      />
    </div>
  </section>;
}
