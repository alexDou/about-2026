import { useIntl } from "../../../../hooks/use-intl";
import { Icon } from "../../../ui/icon";
import { PROFILE_LOOKS, SocialLinks } from "../../../ui/social-links";
import styles from "./styles.module.css";
import type { ContactPanelProps } from "./types";

/**
 * The Contact Panel's content, on the Panel's colour. The info block (where the Owner works from,
 * the Contact notice, the profile links, the "* required" line, a rule between each) stands on the
 * right of a wide screen, centred against the form's inputs; the form, which the page passes in,
 * stands on the left. On a medium screen the info block stands under the form. On a phone the same
 * items run in one column without the rules: the remote line, the form with its button, the
 * notice, the "* required" line, the links.
 */
export function ContactPanel({ content, media, children }: ContactPanelProps) @{
  const intl = useIntl();

  <div class={styles["contact-panel"]}>
    <div class={styles["contact-panel__info"]}>
      <div class={styles["contact-panel__remote"]}>
        <Icon media={media.globe} />
        <span>{intl.formatMessage({ id: content.remote })}</span>
      </div>
      <hr class={styles["contact-panel__rule"]} />
      <div class={styles["contact-panel__notice"]}>
        {intl.formatMessage({ id: content.notice })}
      </div>
      <hr class={styles["contact-panel__rule"]} />
      <div class={styles["contact-panel__links"]}>
        <SocialLinks profiles={content.profiles} look={PROFILE_LOOKS.ring} />
      </div>
      <hr class={styles["contact-panel__rule"]} />
      <div class={styles["contact-panel__required"]}>
        {intl.formatMessage({ id: content.required })}
      </div>
    </div>
    <div class={styles["contact-panel__form"]}>{children}</div>
  </div>;
}
