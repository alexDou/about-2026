import type { PanelId, RouteLink } from "../../../../../hooks/use-route";

export type PanelProps = {
  panel: PanelId;
  /** The Panel's URL, for the browser's own handling (new tab). */
  href: RouteLink["href"];
  /** Opens the Panel in the app. */
  onClick: RouteLink["onClick"];
};
