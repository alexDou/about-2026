import { useLayoutEffect } from "octane";

/**
 * Calls `onEscape` on every Escape key press anywhere in the document while the caller is mounted.
 * It listens from the commit on, not after the next paint: a key pressed right after the panel opens counts.
 */
export function useEscapeKey(onEscape: () => void): void {
  useLayoutEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onEscape();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });
}
