import { useState } from "octane";

/**
 * The value `value` had before its latest change, or `undefined` while it never changed. It keeps
 * that answer through renders that change nothing, so an effect that lists `[value, previous]`
 * runs once per change.
 */
export function usePrevious<T>(value: T): T | undefined {
  const [seen, setSeen] = useState<{ current: T; previous: T | undefined }>({
    current: value,
    previous: undefined,
  });
  if (seen.current !== value) setSeen({ current: value, previous: seen.current });
  return seen.previous;
}
