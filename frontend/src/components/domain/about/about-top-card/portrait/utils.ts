import type { PortraitImage } from "./types";

/** A `srcset` with a width descriptor per image: `a.webp 400w, b.webp 800w`. */
export const srcset = (images: readonly PortraitImage[]): string =>
  images.map((image) => `${image.url} ${image.width}w`).join(", ");
