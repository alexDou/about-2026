import type { MessageId } from "../../../../i18n";
import type { PortraitPhoto } from "./portrait";
import type { Profile } from "./profile-links";

/** What the card says, as message ids. */
export type AboutTopCardContent = {
  name: MessageId;
  headline: MessageId;
  /** The greeting's first sentence; it takes the `{name}`. The Headline follows it. */
  greeting: MessageId;
  credo: MessageId;
  profiles: readonly Profile[];
  cv: { label: MessageId; url: string };
};

/** The card's media files, as URLs: the photo and the brush stroke under it. */
export type AboutTopCardMedia = {
  photo: PortraitPhoto;
  brush: string;
};

export type AboutTopCardProps = {
  content: AboutTopCardContent;
  media: AboutTopCardMedia;
};
