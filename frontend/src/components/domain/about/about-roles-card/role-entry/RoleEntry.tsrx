import { useIntl } from "../../../../../hooks/use-intl";
import styles from "./styles.module.css";
import type { RoleEntryProps } from "./types";

/** One position: title, company with period and place, an optional intro, highlights, technologies. */
export function RoleEntry({ role, technologiesLabel, roleLine }: RoleEntryProps) @{
  const intl = useIntl();

  <div class={styles["role-entry"]}>
    <h3 class={styles["role-entry__title"]}>{intl.formatMessage({ id: role.title })}</h3>
    <p class={styles["role-entry__where"]}>
      {
        intl.formatMessage(
          { id: roleLine },
          {
            company: intl.formatMessage({ id: role.company }),
            period: intl.formatMessage({ id: role.period }),
            place: intl.formatMessage({ id: role.place }),
          },
        ) as string
      }
    </p>
    @if (role.intro) {
      <p class={styles["role-entry__intro"]}>{intl.formatMessage({ id: role.intro })}</p>;
    }
    <ul class={styles["role-entry__highlights"]}>
      @for (const highlight of role.highlights; key highlight) {
        <li>{intl.formatMessage({ id: highlight })}</li>;
      }
    </ul>
    <p class={styles["role-entry__technologies"]}>
      <span class={styles["role-entry__technologies-label"]}>
        {intl.formatMessage({ id: technologiesLabel })}
      </span>
      <span>{` ${intl.formatMessage({ id: role.technologies })}`}</span>
    </p>
  </div>;
}
