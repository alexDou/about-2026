import type { PanelId, RouteLink } from "../../../../../hooks/useRoute";

export type PanelProps = {
  panel: PanelId;
  /** The Panel's URL, for the browser's own handling (new tab). */
  href: RouteLink["href"];
  /** Opens the Panel in the app. */
  onClick: RouteLink["onClick"];
  /** The Panel's title takes part in the Board's entrance. */
  entering: boolean;
};
