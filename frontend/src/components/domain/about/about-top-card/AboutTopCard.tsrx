import { useIntl } from "../../../../hooks/use-intl";
import { Portrait } from "./components/portrait";
import { ProfileLinks } from "./components/profile-links";
import styles from "./styles.module.css";
import type { AboutTopCardProps } from "./types";

/**
 * The first card on About: the greeting and the credo on the left, the photo beside them; under
 * them the profile links and the CV button.
 */
export function AboutTopCard({ content, media }: AboutTopCardProps) @{
  const intl = useIntl();
  const name = intl.formatMessage({ id: content.name });
  const headline = intl.formatMessage({ id: content.headline });

  <article class={styles["about-top-card"]}>
    <div class={styles["about-top-card__text"]}>
      <p class={styles["about-top-card__greeting"]}>
        <span class={styles["about-top-card__sentence"]}>
          {intl.formatMessage({ id: content.greeting.hello }, { name }) as string}
        </span>
        <span class={styles["about-top-card__sentence"]}>
          {intl.formatMessage({ id: content.headline }) as string}
        </span>
      </p>
      <p class={styles["about-top-card__credo"]}>{intl.formatMessage({ id: content.credo })}</p>
    </div>
    <div class={styles["about-top-card__actions"]}>
      <ProfileLinks profiles={content.profiles} />
      // Not a link yet: the CV link (Unit 2.6) makes it one, with the file and its download.
      <span class={styles["about-top-card__cv"]}>
        {intl.formatMessage({ id: content.cvLabel })}
      </span>
    </div>
    <div class={styles["about-top-card__portrait"]}>
      <Portrait photo={media.photo} brush={media.brush} alt={name} />
    </div>
  </article>;
}
