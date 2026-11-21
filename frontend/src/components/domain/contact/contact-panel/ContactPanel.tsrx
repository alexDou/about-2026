import { useIntl } from "../../../../hooks/use-intl";
import { Icon } from "../../../ui/icon";
import { PROFILE_LOOKS, ProfileLinks } from "../../../ui/profile-links";
import styles from "./styles.module.css";
import type { ContactPanelProps } from "./types";

/**
 * The Contact Panel's content, on the Panel's colour. The info block (where the Owner works from,
 * the Contact notice, the profile links between two rules, the "* required" line) stands on the
 * right of a wide screen, centred against the form's inputs; the form, which the page passes in,
 * stands on the left. On a phone the same items run in one column: the remote line, the form with
 * its button, the notice, the "* required" line, the links.
 */
export function ContactPanel({ content, media, children }: ContactPanelProps) @{
  const intl = useIntl();

  <div class={styles["contact-panel"]}>
    <div class={styles["contact-panel__info"]}>
      <p class={styles["contact-panel__remote"]}>
        <Icon media={media.globe} />
        <span>{intl.formatMessage({ id: content.remote })}</span>
      </p>
      <p class={styles["contact-panel__notice"]}>{intl.formatMessage({ id: content.notice })}</p>
      <div class={styles["contact-panel__links"]}>
        <ProfileLinks profiles={content.profiles} look={PROFILE_LOOKS.ring} />
      </div>
      <p class={styles["contact-panel__required"]}>
        {intl.formatMessage({ id: content.required })}
      </p>
    </div>
    <div class={styles["contact-panel__form"]}>{children}</div>
  </div>;
}
