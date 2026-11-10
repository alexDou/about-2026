import { useId, useLayoutEffect, useRef } from "octane";
import { useAnimationFrame } from "../../../hooks/useAnimationFrame";
import { GLOW_STD_DEVIATION, TONES, VIEW_BOX, WEAVE_SETTINGS } from "./config";
import { lineClipPath, linePath, ringClipPath, ringPath, toneOf } from "./geometry";
import styles from "./styles.module.css";
import type { AnimatedLogoProps, WeaveSettings } from "./types";

/** Phase advance per second at speed 1 (Loop Lab "Motion" scale). */
const PHASE_PER_SPEED = 1 / 150;

function toneClass(tone: number) {
  return styles[`w${tone}`];
}

/** Draws every weave line at `elapsed` seconds of animation. */
function drawWeave(
  ringGroup: SVGGElement | null,
  lineGroup: SVGGElement | null,
  { ring, line }: WeaveSettings,
  elapsed: number,
) {
  const ringPhase = elapsed * ring.speed * PHASE_PER_SPEED;
  const linePhase = elapsed * line.speed * PHASE_PER_SPEED;
  ringGroup?.querySelectorAll("path").forEach((path, i) => {
    path.setAttribute("d", ringPath(ring, i, ringPhase));
  });
  lineGroup?.querySelectorAll("path").forEach((path, i) => {
    path.setAttribute("d", linePath(line, i, linePhase));
  });
}

function layers(weave: number) {
  return Array.from({ length: weave }, (_, i) => toneOf(i, weave, TONES));
}

/**
 * The animated "a" logo: two woven bands (the O and the curved line), drawn as SVG paths.
 * The weave is redrawn imperatively each frame; hover and focus swap the color palette in CSS.
 */
export function AnimatedLogo({
  label,
  onClick,
  settings = WEAVE_SETTINGS,
}: AnimatedLogoProps) @{
  const id = useId().replace(/[^\w-]/g, "");
  const ringRef = useRef<SVGGElement>(null);
  const lineRef = useRef<SVGGElement>(null);

  // First frame before paint (and the only frame under reduced motion).
  useLayoutEffect(() => {
    drawWeave(ringRef.current, lineRef.current, settings, 0);
  }, [settings]);

  useAnimationFrame((elapsed) => {
    drawWeave(ringRef.current, lineRef.current, settings, elapsed);
  });

  const ringId = `${id}-ring`;
  const lineId = `${id}-line`;

  <button type="button" class={styles["logo"]} aria-label={label} onClick={onClick}>
    <svg class={styles["svg"]} viewBox={VIEW_BOX} aria-hidden="true" focusable="false">
      <defs>
        <filter id={`${id}-glow`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation={GLOW_STD_DEVIATION} />
        </filter>
        <clipPath id={`${id}-clip-ring`}>
          <path clipRule="evenodd" d={ringClipPath(settings.ring.thickness)} />
        </clipPath>
        <clipPath id={`${id}-clip-line`}>
          <path d={lineClipPath(settings.line.thickness)} />
        </clipPath>
      </defs>
      // Glow copies reference the live weave groups.
      <use href={`#${ringId}`} class={styles["glow"]} filter={`url(#${id}-glow)`} />
      <use href={`#${lineId}`} class={styles["glow"]} filter={`url(#${id}-glow)`} />
      <g id={ringId} clipPath={`url(#${id}-clip-ring)`}>
        <g ref={ringRef} class={[styles["weave"], styles["ring"]]} data-part="ring">
          @for (const tone of layers(settings.ring.weave)) {
            <path class={toneClass(tone)} />;
          }
        </g>
      </g>
      <g id={lineId} clipPath={`url(#${id}-clip-line)`}>
        <g ref={lineRef} class={[styles["weave"], styles["line"]]} data-part="line">
          @for (const tone of layers(settings.line.weave)) {
            <path class={toneClass(tone)} />;
          }
        </g>
      </g>
    </svg>
  </button>;
}
