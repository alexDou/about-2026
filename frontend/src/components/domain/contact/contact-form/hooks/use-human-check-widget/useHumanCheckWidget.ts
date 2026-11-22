import { useEffect, useState } from "octane";
import { WIDGET_LOAD } from "../../config";
import type { WidgetLoad } from "../../types";
import { loadHumanCheckWidget } from "./load";

/**
 * Loads the ALTCHA widget when the Contact form opens, and says where that stands: `ready` once
 * `<altcha-widget>` is defined, `failed` (and logged) if the chunk cannot load. The browser keeps
 * a failed `import()`, so only a reload brings the widget.
 */
export function useHumanCheckWidget(): WidgetLoad {
  const [load, setLoad] = useState<WidgetLoad>(WIDGET_LOAD.loading);
  useEffect(() => {
    let mounted = true;
    loadHumanCheckWidget().then(
      () => {
        if (mounted) setLoad(WIDGET_LOAD.ready);
      },
      (error: unknown) => {
        console.error("The ALTCHA widget could not load", error);
        if (mounted) setLoad(WIDGET_LOAD.failed);
      },
    );
    return () => {
      mounted = false;
    };
  }, []);
  return load;
}
