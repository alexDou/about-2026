import { Card } from "../../../ui/card";
import { CardHeading } from "../../../ui/card-heading";
import { useIntl } from "../../../../hooks/use-intl";
import styles from "./styles.module.css";
import type { AboutLanguagesHobbiesCardProps } from "./types";

/** One card, two columns: the languages as "name: level (CEFR)", and the Hobbies. */
export function AboutLanguagesHobbiesCard({
  headings,
  languageLines,
  languages,
  hobbies,
}: AboutLanguagesHobbiesCardProps) @{
  const intl = useIntl();

  <Card>
    <div class={styles["about-languages-hobbies-card__columns"]}>
      <div class={styles["about-languages-hobbies-card__column"]}>
        <CardHeading text={intl.formatMessage({ id: headings.languages })} />
        <ul class={styles["about-languages-hobbies-card__list"]}>
          @for (const language of languages; key language.name) {
            <li>
              {
                intl.formatMessage(
                  { id: language.cefr ? languageLines.withCefr : languageLines.plain },
                  {
                    name: intl.formatMessage({ id: language.name }),
                    level: intl.formatMessage({ id: language.level }),
                    cefr: language.cefr ? intl.formatMessage({ id: language.cefr }) : "",
                  },
                ) as string
              }
            </li>;
          }
        </ul>
      </div>
      <div class={styles["about-languages-hobbies-card__column"]}>
        <CardHeading text={intl.formatMessage({ id: headings.hobbies })} />
        <ul class={styles["about-languages-hobbies-card__list"]}>
          @for (const hobby of hobbies; key hobby.name) {
            <li>
              <h3 class={styles["about-languages-hobbies-card__hobby-name"]}>
                {intl.formatMessage({ id: hobby.name })}
              </h3>
              <span class={styles["about-languages-hobbies-card__hobby-text"]}>
                {intl.formatMessage({ id: hobby.text })}
              </span>
            </li>;
          }
        </ul>
      </div>
    </div>
  </Card>;
}
