import { useIntl } from "../../../../hooks/use-intl";
import { Portrait } from "./portrait";
import { ProfileLinks } from "../../../ui/profile-links";
import styles from "./styles.module.css";
import type { AboutTopCardProps } from "./types";

/**
 * The first card on About: the greeting and the credo on the left, the photo beside them; under
 * them the profile links and the CV button.
 */
export function AboutTopCard({ content, media }: AboutTopCardProps) @{
  const intl = useIntl();
  const name = intl.formatMessage({ id: content.name });

  <article class={styles["about-top-card"]}>
    <div class={styles["about-top-card__text"]}>
      <p class={styles["about-top-card__greeting"]}>
        <span class={styles["about-top-card__sentence"]}>
          {intl.formatMessage({ id: content.greeting }, { name }) as string}
        </span>
        <span class={styles["about-top-card__sentence"]}>
          {intl.formatMessage({ id: content.headline }) as string}
        </span>
      </p>
      <p class={styles["about-top-card__credo"]}>{intl.formatMessage({ id: content.credo })}</p>
    </div>
    <div class={styles["about-top-card__actions"]}>
      <ProfileLinks profiles={content.profiles} />
      <a class={styles["about-top-card__cv"]} href={content.cv.url} download>
        {intl.formatMessage({ id: content.cv.label })}
      </a>
    </div>
    <div class={styles["about-top-card__portrait"]}>
      <Portrait photo={media.photo} brush={media.brush} alt={name} />
    </div>
  </article>;
}
