import cx from "classnames";
import { panelRoute, useRoute } from "../../../../../hooks/useRoute";
import { useIntl } from "../../../../../hooks/useIntl";
import { Sublabel } from "./components/Sublabel";
import { SUBLABEL_BY_PANEL, TITLE_BY_PANEL } from "./config";
import styles from "./styles.module.css";
import type { PanelProps } from "./types";

/** One area of the Board: its title as a link to the Panel's URL, and its Sublabel when it has one. */
export function Panel({ panel, tone }: PanelProps) @{
  const intl = useIntl();
  const { link } = useRoute();
  const { href, onClick } = link(panelRoute(panel));
  const sublabelId = SUBLABEL_BY_PANEL[panel];

  <li class={cx(styles["panel"], styles[tone])}>
    <div class={styles["content"]}>
      <a class={styles["title"]} href={href} onClick={onClick}>
        {intl.formatMessage({ id: TITLE_BY_PANEL[panel] })}
      </a>
      @if (sublabelId) {
        <Sublabel text={intl.formatMessage({ id: sublabelId })} />;
      }
    </div>
  </li>;
}
