import type { WidgetAttributes } from "altcha/types";
import type { HumanCheckChange } from "./types";

// `<altcha-widget>` is the custom element of the `altcha` package. Octane types intrinsic elements
// by tag, so the tag is declared here with the attributes the form sets.
declare module "octane/jsx-runtime" {
  namespace Octane {
    namespace JSX {
      interface IntrinsicElements {
        "altcha-widget": WidgetAttributes & {
          class?: string;
          /** Set by the `@for` that replaces a used widget. */
          key?: string | number;
          /** The widget's state changed: its `detail` holds the state and the solved payload. */
          onstatechange?: (event: HumanCheckChange) => void;
        };
      }
    }
  }
}
