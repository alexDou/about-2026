import { useEffect, useState } from "octane";
import { SECOND_MS } from "./config";
import type { CountdownProps } from "./types";

/**
 * Counts whole seconds down to 0 and says what is left in `format`'s text. The seconds are this
 * component's own state, so only this text renders again each second; the component around it
 * does not. `onDone` is called once, when it reaches 0.
 */
export function Countdown({ from, format, onDone }: CountdownProps) @{
  const [remaining, setRemaining] = useState(from);

  useEffect(() => {
    if (remaining <= 0) {
      onDone();
      return;
    }
    const timer = setTimeout(() => setRemaining(remaining - 1), SECOND_MS);
    return () => clearTimeout(timer);
  });

  <span>{format(remaining)}</span>;
}
