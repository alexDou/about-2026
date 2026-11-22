import github from "./media/github.svg";
import linkedin from "./media/linkedin.svg";
import xing from "./media/xing.svg";

/** The profiles the Owner links, each drawn with its own icon. */
export const PROFILE_KINDS = {
  linkedin: "linkedin",
  xing: "xing",
  github: "github",
} as const;

/** How the links look: bare icons (About), or round icons that get a ring on hover (Contact). */
export const PROFILE_LOOKS = {
  plain: "plain",
  ring: "ring",
} as const;

/**
 * Each profile's icon file, in `media/`. LinkedIn is our own drawing of its mark (the letters cut
 * out of the square); GitHub's and Xing's are Simple Icons paths (CC0 1.0, simple-icons 15.0.0).
 * The brands allow their mark on a link to a profile.
 */
export const PROFILE_ICONS = {
  [PROFILE_KINDS.linkedin]: linkedin,
  [PROFILE_KINDS.xing]: xing,
  [PROFILE_KINDS.github]: github,
} as const;
