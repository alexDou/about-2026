/** One width of the photo in one format. */
export type PortraitImage = {
  url: string;
  width: number;
};

/**
 * The photo at each width, in AVIF and in WebP (the fallback), smallest first; `width` and
 * `height` are the smallest one's, which give the image its aspect ratio before it loads.
 */
export type PortraitPhoto = {
  avif: readonly PortraitImage[];
  webp: readonly PortraitImage[];
  width: number;
  height: number;
};

export type PortraitProps = {
  photo: PortraitPhoto;
  /** The brush stroke's file: an SVG whose root has the id `brush`. */
  brush: string;
  /** The photo's text alternative. */
  alt: string;
};
