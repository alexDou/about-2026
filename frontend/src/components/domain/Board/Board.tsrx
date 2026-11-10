import cx from "classnames";
import { useState } from "octane";
import { PANEL_IDS, useRoute } from "../../../hooks/useRoute";
import { Panel } from "./components/Panel";
import { TONE_BY_PANEL } from "./config";
import styles from "./styles.module.css";

/** The five Panels, in order, each in its tone. */
export function Board() @{
  const { userTriggered } = useRoute();
  // Read once, at mount: a click on the Landing's logo is the only user action that mounts the
  // Board. A direct visit, a reload and Back/Forward arrive with `userTriggered` false and no entrance.
  const [entrance] = useState(userTriggered);

  <main class={cx(styles["board"], entrance && styles["entrance"])}>
    <ul class={styles["panels"]}>
      @for (const panel of PANEL_IDS; key panel) {
        <Panel panel={panel} tone={TONE_BY_PANEL[panel]} entering={entrance} />;
      }
    </ul>
  </main>;
}
