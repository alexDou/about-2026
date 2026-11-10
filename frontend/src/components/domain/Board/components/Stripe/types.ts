import type { PanelTone } from "../../types";

export type StripeProps = {
  tone: PanelTone;
  title: string;
  /** The Panel's URL, for the browser's own handling (new tab). */
  href: string;
  /** Opens the Panel in the app. */
  onClick: (event: MouseEvent) => void;
};
