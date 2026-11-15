/** The Landing's URL. */
export const LANDING_PATH = "/";

/** The URL of Explore with no Panel open. */
export const EXPLORE_PATH = "/explore";

/** Explore's Panels, in Explore order. */
export const PANEL_IDS = ["about", "whatIDo", "skills", "chatWithMe", "contact"] as const;

/** The URL of each Panel when it is the Expanded panel. */
export const PANEL_PATHS = {
  about: "/about",
  whatIDo: "/what-i-do",
  skills: "/skills",
  chatWithMe: "/chat",
  contact: "/contact",
} as const satisfies Record<(typeof PANEL_IDS)[number], `/${string}`>;

/** The two states Explore is in: no Panel open, or one Expanded panel. */
export const EXPLORE_KIND = { default: "default", expanded: "expanded" } as const;
