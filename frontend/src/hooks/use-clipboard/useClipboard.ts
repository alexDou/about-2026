import { useEffect, useState } from "octane";
import type { UseClipboardResult } from "./types";

/**
 * Copies text to the system clipboard (`navigator.clipboard.writeText`, imperative by agreement
 * with the Owner: there is no declarative way) and reports `copied` for `resetMs` after a copy
 * went through. A second copy within that time starts the time again. When the browser has no
 * clipboard or refuses the write (no permission, no secure context), nothing is reported as copied.
 */
export function useClipboard(resetMs: number): UseClipboardResult {
  // Null until a copy went through, then a count that goes up with each one so that a repeat
  // copy runs the effect again and starts the time over.
  const [copies, setCopies] = useState<number | null>(null);

  useEffect(() => {
    if (copies === null) return;
    const timer = setTimeout(() => setCopies(null), resetMs);
    return () => clearTimeout(timer);
  }, [copies, resetMs]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopies((previous) => (previous ?? 0) + 1);
    } catch {
      // Refused, or no clipboard in this browser: the Visitor sees no "Copied".
    }
  };

  return { copied: copies !== null, copy };
}
