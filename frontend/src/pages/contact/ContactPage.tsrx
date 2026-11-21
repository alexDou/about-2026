import { ContactForm } from "../../components/domain/contact/contact-form";
import { ContactPanel } from "../../components/domain/contact/contact-panel";
import { OfflineNote } from "../../components/domain/offline-note";
import { Heading } from "../../components/ui/heading";
import { useIntl } from "../../hooks/use-intl";
import { CONTACT_CONTENT } from "./content";
import globe from "./media/globe.svg";
import styles from "./styles.module.css";

/**
 * The Contact Panel's page: the heading and its subtitle, then the form and the info block beside
 * it, which the panel lays out.
 */
export function ContactPage() @{
  const intl = useIntl();

  <section class={styles["contact-page"]}>
    <header class={styles["contact-page__header"]}>
      <Heading text={intl.formatMessage({ id: CONTACT_CONTENT.title })} />
      <p class={styles["contact-page__subtitle"]}>
        {intl.formatMessage({ id: CONTACT_CONTENT.subtitle })}
      </p>
    </header>
    <OfflineNote />
    <ContactPanel content={CONTACT_CONTENT} media={{ globe }}>
      <ContactForm content={CONTACT_CONTENT.form} />
    </ContactPanel>
  </section>;
}
