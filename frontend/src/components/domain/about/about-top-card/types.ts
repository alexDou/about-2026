import type { MessageId } from "../../../../i18n";
import type { PortraitPhoto } from "./components/portrait";
import type { Profile } from "./components/profile-links";

/** The greeting's two sentences: `hello` takes the `{name}`, `headline` the `{headline}`. */
export type AboutTopCardGreeting = {
  hello: MessageId;
  headline: MessageId;
};

/** What the card says, as message ids. */
export type AboutTopCardContent = {
  name: MessageId;
  headline: MessageId;
  greeting: AboutTopCardGreeting;
  credo: MessageId;
  profiles: readonly Profile[];
  cvLabel: MessageId;
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
