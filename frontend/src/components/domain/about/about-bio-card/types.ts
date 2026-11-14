import type { MessageId } from "../../../../i18n";

export type AboutBioCardProps = {
  heading: MessageId;
  /** Two paragraphs: what the Owner does professionally, then the personal facts. */
  bio: {
    professional: MessageId;
    personal: MessageId;
  };
};
