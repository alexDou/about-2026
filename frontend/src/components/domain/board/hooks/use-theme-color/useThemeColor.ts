import { useEffect } from "octane";
import { THEME_COLOR_META } from "./config";

/**
 * Shows the value of the CSS custom property `token` (a colour) as the browser's `theme-color`
 * while the caller is mounted, then gives the earlier colour back. `null` leaves it alone.
 */
export function useThemeColor(token: string | null): void {
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>(THEME_COLOR_META);
    if (!token || !meta) return;
    const color = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
    if (!color) return;
    const previous = meta.content;
    meta.content = color;
    return () => {
      meta.content = previous;
    };
  });
}
