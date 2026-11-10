import { PANEL_IDS } from "../../../hooks/useRoute";
import { Panel } from "./components/Panel";
import { TONE_BY_PANEL } from "./config";
import styles from "./styles.module.css";

/** The five Panels, in order, each in its tone. */
export function Board() @{
  <main class={styles["board"]}>
    <ul class={styles["panels"]}>
      @for (const panel of PANEL_IDS; key panel) {
        <Panel panel={panel} tone={TONE_BY_PANEL[panel]} />;
      }
    </ul>
  </main>;
}
