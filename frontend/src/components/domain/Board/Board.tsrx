import { PANEL_IDS, panelRoute, useRoute } from "../../../hooks/useRoute";
import { useIntl } from "../../../hooks/useIntl";
import { TITLE_BY_PANEL } from "./config";
import styles from "./styles.module.css";

/** The five Panels, in order, as links. Opening one comes with the Expanded panel. */
export function Board() @{
  const intl = useIntl();
  const { link } = useRoute();

  <main class={styles["board"]}>
    <ul class={styles["panels"]}>
      @for (const panel of PANEL_IDS; key panel) {
        const { href, onClick } = link(panelRoute(panel));
        <li class={styles["panel"]}>
          <a class={styles["title"]} href={href} onClick={onClick}>
            {intl.formatMessage({ id: TITLE_BY_PANEL[panel] })}
          </a>
        </li>;
      }
    </ul>
  </main>;
}
