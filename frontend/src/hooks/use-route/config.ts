/** The Landing's URL. */
export const LANDING_PATH = "/";

/** The URL of the Board with no Panel open. */
export const BOARD_PATH = "/explore";

/** The Board's Panels, in Board order. */
export const PANEL_IDS = ["about", "whatIDo", "skills", "chatWithMe", "contact"] as const;

/** The URL of each Panel when it is the Expanded panel. */
export const PANEL_PATHS = {
  about: "/about",
  whatIDo: "/what-i-do",
  skills: "/skills",
  chatWithMe: "/chat",
  contact: "/contact",
} as const satisfies Record<(typeof PANEL_IDS)[number], `/${string}`>;

/** The two states the Board is in: no Panel open, or one Expanded panel. */
export const BOARD_KIND = { default: "default", expanded: "expanded" } as const;
