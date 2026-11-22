import { useEffect, useState } from "octane";
import { loadHumanCheckWidget } from "./load";

/**
 * Loads the ALTCHA widget when the Contact form opens. `true` once `<altcha-widget>` is defined;
 * until then (and for good if the chunk cannot load, e.g. offline) the form cannot be sent.
 */
export function useHumanCheckWidget(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let mounted = true;
    loadHumanCheckWidget().then(
      () => {
        if (mounted) setReady(true);
      },
      () => {},
    );
    return () => {
      mounted = false;
    };
  }, []);
  return ready;
}
