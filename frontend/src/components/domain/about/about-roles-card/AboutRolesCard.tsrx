import { Card } from "../../../ui/card";
import { CardHeading } from "../../../ui/card-heading";
import { useIntl } from "../../../../hooks/use-intl";
import { RoleEntry } from "./components/role-entry";
import styles from "./styles.module.css";
import type { AboutRolesCardProps } from "./types";

/** The Roles card: the work history, newest first. */
export function AboutRolesCard({
  heading,
  technologiesLabel,
  roleLine,
  roles,
}: AboutRolesCardProps) @{
  const intl = useIntl();

  <Card>
    <CardHeading text={intl.formatMessage({ id: heading })} />
    <ol class={styles["about-roles-card__list"]}>
      @for (const role of roles; key role.title) {
        <li>
          <RoleEntry role={role} technologiesLabel={technologiesLabel} roleLine={roleLine} />
        </li>;
      }
    </ol>
  </Card>;
}
