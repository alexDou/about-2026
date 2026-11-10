import cx from "classnames";
import { useIntl } from "../../../../../hooks/useIntl";
import { Sublabel } from "./components/Sublabel";
import { TITLE_BY_PANEL } from "../../config";
import { SUBLABEL_BY_PANEL } from "./config";
import styles from "./styles.module.css";
import type { PanelProps } from "./types";

/** One area of the Board: its title as a link to the Panel's URL, and its Sublabel when it has one. */
export function Panel({ panel, href, onClick, entering }: PanelProps) @{
  const intl = useIntl();
  const sublabelId = SUBLABEL_BY_PANEL[panel];

  <div class={cx(styles["panel"], entering && styles["entering"])}>
    <div class={styles["content"]}>
      <a class={styles["title"]} href={href} onClick={onClick}>
        {intl.formatMessage({ id: TITLE_BY_PANEL[panel] })}
      </a>
      @if (sublabelId) {
        <Sublabel text={intl.formatMessage({ id: sublabelId })} />;
      }
    </div>
  </div>;
}
