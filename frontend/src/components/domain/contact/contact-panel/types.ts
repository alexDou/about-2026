import type { OctaneNode } from "octane";
import type { MessageId } from "../../../../i18n";
import type { Profile } from "../../../ui/social-links";

/** What the panel says, as message ids, and where the Owner's profiles are. */
export type ContactPanelContent = {
  remote: MessageId;
  profiles: readonly Profile[];
  notice: MessageId;
  /** The line that explains the form's asterisk. */
  required: MessageId;
};

/** The files the panel draws from: the page owns them and passes them down. */
export type ContactPanelMedia = {
  /** The icon beside "Remote, worldwide". */
  globe: string;
};

export type ContactPanelProps = {
  content: ContactPanelContent;
  media: ContactPanelMedia;
  /** The form: its fields and its button become items of the grid, in its `fields` and `submit` areas. */
  children?: OctaneNode;
};
