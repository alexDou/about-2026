import type { WeaveSettings } from "./types";

/** Tuned in the logo/ playground (see logo/panel.js). Colors live in styles.module.css. */
export const WEAVE_SETTINGS: WeaveSettings = {
  ring: { petals: 18, weave: 33, spread: 8, wobble: 0.07, speed: 100, thickness: 66 },
  line: { wavelength: 44, weave: 52, spread: 7, wobble: 0.37, speed: 100, thickness: 65 },
};

/** Gaussian blur of the glow layer. */
export const GLOW_STD_DEVIATION = 0.5;

/** Visible area of the source geometry. */
export const VIEW_BOX = "150 124 434 303";

/** Each weave is split into three color tones (w1..w3). */
export const TONES = 3;

/**
 * Box of the "Dooooo.." wordmark (dooooo.svg), centered in the O's hole.
 * The hole is centered at (306, 306) with radius 84.5 - 66 / 2 = 51.5; the box keeps a clear margin.
 */
export const WORDMARK_BOX = { x: 266, y: 295.5, width: 80, height: 21 } as const;
