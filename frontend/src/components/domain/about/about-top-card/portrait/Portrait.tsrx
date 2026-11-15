import { BRUSH_ID, BRUSH_VIEW_BOX, PHOTO_SIZES } from "./config";
import styles from "./styles.module.css";
import type { PortraitProps } from "./types";
import { srcset } from "./utils";

/**
 * The Owner's cut-out photo over a brush stroke. The stroke is drawn from its file through
 * `<use>`, so it takes its colour from CSS; an `<img>` could not.
 */
export function Portrait({ photo, brush, alt }: PortraitProps) @{
  const [smallest] = photo.webp;

  <div class={styles["portrait"]}>
    <svg class={styles["portrait__brush"]} viewBox={BRUSH_VIEW_BOX} aria-hidden="true">
      <use href={`${brush}#${BRUSH_ID}`} />
    </svg>
    <picture class={styles["portrait__picture"]}>
      <source type="image/avif" srcSet={srcset(photo.avif)} sizes={PHOTO_SIZES} />
      <img
        class={styles["portrait__photo"]}
        src={smallest?.url}
        srcSet={srcset(photo.webp)}
        sizes={PHOTO_SIZES}
        width={photo.width}
        height={photo.height}
        alt={alt}
      />
    </picture>
  </div>;
}
