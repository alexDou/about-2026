import cx from "classnames";
import { useIntl } from "../../../hooks/use-intl";
import { Icon, ICON_SIZES } from "../icon";
import { PROFILE_ICONS, PROFILE_LOOKS } from "./config";
import styles from "./styles.module.css";
import type { SocialLinksProps } from "./types";

/** The Owner's profiles elsewhere, one icon link each, named by its label. */
export function SocialLinks({ profiles, look = PROFILE_LOOKS.plain }: SocialLinksProps) @{
  const intl = useIntl();

  <ul class={cx(styles["social-links"], styles[`social-links--${look}`])}>
    @for (const profile of profiles; key profile.kind) {
      <li>
        <a
          class={cx(styles["social-links__link"], styles[`social-links__link--${look}`])}
          href={profile.url}
          aria-label={intl.formatMessage({ id: profile.label })}
        >
          <Icon
            media={PROFILE_ICONS[profile.kind]}
            size={look === PROFILE_LOOKS.plain ? ICON_SIZES.large : ICON_SIZES.small}
          />
        </a>
      </li>;
    }
  </ul>;
}
