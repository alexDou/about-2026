/** The availability badges, in the order they show. */
export const ABOUT_BADGE_KINDS = [
  "availableNow",
  "fullTime",
  "contract",
  "relocation",
  "remoteWork",
  "aiReady",
] as const;

/** The Roles on About, newest first: each number is the Role's position in that order. */
export const ABOUT_ROLE_NUMBERS = [1, 2, 3, 4, 5] as const;

/** The languages the Owner speaks, in the order they show. */
export const ABOUT_LANGUAGE_KINDS = ["russian", "english", "german", "spanish"] as const;

/** The Hobbies on About, each by its position in the list. */
export const ABOUT_HOBBY_NUMBERS = [1, 2, 3, 4, 5] as const;
