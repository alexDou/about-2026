import { useIntl } from "../../../../hooks/use-intl";
import { PROFILE_LOOKS, ProfileLinks } from "../../../ui/profile-links";
import styles from "./styles.module.css";
import type { ContactPanelProps } from "./types";

/**
 * The Contact Panel's band. Left: where the Owner works from, the profile links between two rules,
 * and the Contact notice. Right: the form, which the page passes in. The markup runs in the order
 * of a phone (remote line, links, form, notice); a wide screen places the same items in two columns.
 * What it is given joins the panel's grid: its fieldset or note in `fields`, its button in `submit`.
 */
export function ContactPanel({ content, children }: ContactPanelProps) @{
  const intl = useIntl();

  <div class={styles["contact-panel"]}>
    <p class={styles["contact-panel__remote"]}>
      <svg class={styles["contact-panel__globe"]} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </svg>
      <span>{intl.formatMessage({ id: content.remote })}</span>
    </p>
    <div class={styles["contact-panel__links"]}>
      <ProfileLinks profiles={content.profiles} look={PROFILE_LOOKS.ring} />
    </div>
    <div class={styles["contact-panel__form"]}>{children}</div>
    <p class={styles["contact-panel__notice"]}>{intl.formatMessage({ id: content.notice })}</p>
  </div>;
}
