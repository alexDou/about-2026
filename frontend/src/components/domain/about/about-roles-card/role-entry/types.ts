import type { MessageId } from "../../../../../i18n";

export type RoleEntryRole = {
  title: MessageId;
  company: MessageId;
  period: MessageId;
  place: MessageId;
  intro?: MessageId;
  highlights: readonly MessageId[];
  technologies: MessageId;
};

export type RoleEntryProps = {
  role: RoleEntryRole;
  technologiesLabel: MessageId;
  /** "{company} · {period} · {place}". */
  roleLine: MessageId;
};
