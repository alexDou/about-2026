import { Card } from "../../../ui/card";
import { CardHeading } from "../../../ui/card-heading";
import { useIntl } from "../../../../hooks/use-intl";
import styles from "./styles.module.css";
import type { AboutEducationCardProps } from "./types";

/** The Education card: the degree, where and when, and what it built. */
export function AboutEducationCard({ heading, education }: AboutEducationCardProps) @{
  const intl = useIntl();

  <Card>
    <CardHeading text={intl.formatMessage({ id: heading })} />
    <h3 class={styles["about-education-card__degree"]}>
      {intl.formatMessage({ id: education.degree })}
    </h3>
    <p class={styles["about-education-card__where"]}>
      {
        intl.formatMessage(
          { id: education.line },
          {
            school: intl.formatMessage({ id: education.school }),
            place: intl.formatMessage({ id: education.place }),
            year: intl.formatMessage({ id: education.year }),
          },
        ) as string
      }
    </p>
    <p class={styles["about-education-card__business"]}>
      {intl.formatMessage({ id: education.business })}
    </p>
  </Card>;
}
