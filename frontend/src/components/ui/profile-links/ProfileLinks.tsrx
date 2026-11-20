import { useIntl } from "../../../hooks/use-intl";
import { PROFILE_ICON_VIEW_BOX, PROFILE_ICONS, PROFILE_LOOKS } from "./config";
import styles from "./styles.module.css";
import type { ProfileLinksProps } from "./types";

/** The Owner's profiles elsewhere, one icon link each, named by its label. */
export function ProfileLinks({
  profiles,
  look = PROFILE_LOOKS.plain,
}: ProfileLinksProps) @{
  const intl = useIntl();

  <ul class={`${styles["profile-links"]} ${styles[`profile-links--${look}`]}`}>
    @for (const profile of profiles; key profile.kind) {
      <li>
        <a
          class={`${styles["profile-links__link"]} ${styles[`profile-links__link--${look}`]}`}
          href={profile.url}
          aria-label={intl.formatMessage({ id: profile.label })}
        >
          <svg
            class={styles["profile-links__icon"]}
            viewBox={PROFILE_ICON_VIEW_BOX}
            aria-hidden="true"
          >
            <path
              d={PROFILE_ICONS[profile.kind].d}
              fillRule={PROFILE_ICONS[profile.kind].fillRule}
            />
          </svg>
        </a>
      </li>;
    }
  </ul>;
}
