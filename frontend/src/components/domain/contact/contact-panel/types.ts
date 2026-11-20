import type { OctaneNode } from "octane";
import type { MessageId } from "../../../../i18n";
import type { Profile } from "../../../ui/profile-links";

/** What the panel says, as message ids, and where the Owner's profiles are. */
export type ContactPanelContent = {
  remote: MessageId;
  profiles: readonly Profile[];
  notice: MessageId;
};

export type ContactPanelProps = {
  content: ContactPanelContent;
  /** The form column. */
  children?: OctaneNode;
};
