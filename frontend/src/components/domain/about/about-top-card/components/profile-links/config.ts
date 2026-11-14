/** The profiles the top card links, each drawn with its own icon. */
export const PROFILE_KINDS = {
  linkedin: "linkedin",
  github: "github",
} as const;

/** The icons' drawing area: a 24×24 grid. */
export const PROFILE_ICON_VIEW_BOX = "0 0 24 24";

/**
 * Each profile's icon. LinkedIn is our own drawing of its mark (the letters cut out of the square,
 * hence `evenodd`); GitHub's is the Simple Icons path (CC0 1.0, simple-icons 15.0.0). Both brands
 * allow their mark on a link to a profile.
 */
export const PROFILE_ICONS = {
  [PROFILE_KINDS.linkedin]: {
    d: "M5 2h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zM7.6 5.6a1.6 1.6 0 1 0 0 3.2a1.6 1.6 0 1 0 0-3.2zM6.2 10h2.8v8.4H6.2zM11 10h2.7v1.2c.5-.8 1.5-1.4 2.8-1.4 2.3 0 3.3 1.4 3.3 3.9v4.7h-2.8v-4.3c0-1.2-.4-1.9-1.4-1.9-1.1 0-1.9.8-1.9 2v4.2H11z",
    fillRule: "evenodd",
  },
  [PROFILE_KINDS.github]: {
    d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
    fillRule: "nonzero",
  },
} as const;
