import { ContactForm } from "../../components/domain/contact/contact-form";
import { ContactPanel } from "../../components/domain/contact/contact-panel";
import { OfflineNote } from "../../components/domain/offline-note";
import { Heading } from "../../components/ui/heading";
import { useIntl } from "../../hooks/use-intl";
import { CONTACT_CONTENT } from "./content";
import styles from "./styles.module.css";

/** The Contact Panel's page: the heading, then the band with the links, the notice and the form. */
export function ContactPage() @{
  const intl = useIntl();

  <section class={styles["contact-page"]}>
    <Heading text={intl.formatMessage({ id: "explore.panel.contact.title" })} />
    <OfflineNote />
    <ContactPanel content={CONTACT_CONTENT}>
      <ContactForm content={CONTACT_CONTENT.form} />
    </ContactPanel>
  </section>;
}
