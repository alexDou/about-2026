import type { MessageId } from "../../../../i18n";
import type { RoleEntryRole } from "./role-entry";

export type AboutRolesCardProps = {
  heading: MessageId;
  /** The label before each Role's technologies line. */
  technologiesLabel: MessageId;
  /** "{company} · {period} · {place}", the line under each Role's title. */
  roleLine: MessageId;
  /** In the order they show: newest first. */
  roles: readonly RoleEntryRole[];
};
