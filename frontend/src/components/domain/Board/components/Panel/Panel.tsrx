import "octane/signals";
import cx from "classnames";
import { useIntl } from "../../../../../hooks/useIntl";
import { entering$, titleShown } from "../../motion";
import { Sublabel } from "./components/Sublabel";
import { TITLE_BY_PANEL } from "../../config";
import { SUBLABEL_BY_PANEL } from "./config";
import styles from "./styles.module.css";
import type { PanelProps } from "./types";

/**
 * One area of the Board: its title as a link to the Panel's URL, and its Sublabel when it has one.
 * Its title fades in as the last step of the Board's entrance and tells the Board's motion.
 */
export function Panel({ panel, href, onClick }: PanelProps) @{
  const intl = useIntl();
  const sublabelId = SUBLABEL_BY_PANEL[panel];

  <div class={cx(styles["panel"], entering$.get() && styles["entering"])}>
    <div
      class={styles["content"]}
      onAnimationEnd={(event) => {
        // The title's fade-in is the last step of the entrance; animations inside it are not.
        if (event.target === event.currentTarget) titleShown(panel);
      }}
    >
      <a class={styles["title"]} href={href} onClick={onClick}>
        {intl.formatMessage({ id: TITLE_BY_PANEL[panel] })}
      </a>
      @if (sublabelId) {
        <Sublabel text={intl.formatMessage({ id: sublabelId })} />;
      }
    </div>
  </div>;
}
