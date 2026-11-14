import { Card } from "../../../ui/card";
import { CardHeading } from "../../../ui/card-heading";
import { useIntl } from "../../../../hooks/use-intl";
import styles from "./styles.module.css";
import type { AboutBioCardProps } from "./types";

/** The Bio card: the Owner's two paragraphs. */
export function AboutBioCard({ heading, bio }: AboutBioCardProps) @{
  const intl = useIntl();

  <Card>
    <CardHeading text={intl.formatMessage({ id: heading })} />
    <p class={styles["about-bio-card__paragraph"]}>
      {intl.formatMessage({ id: bio.professional })}
    </p>
    <p class={styles["about-bio-card__paragraph"]}>{intl.formatMessage({ id: bio.personal })}</p>
  </Card>;
}
