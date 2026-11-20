import { useEffect, useState } from "octane";
import type { Countdown } from "./types";

/** Counts whole seconds down to 0, one second at a time. */
export function useCountdown(): Countdown {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setTimeout(() => setRemaining(remaining - 1), 1000);
    return () => clearTimeout(timer);
  });

  return { remaining, start: setRemaining };
}
