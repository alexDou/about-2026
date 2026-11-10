import cx from "classnames";
import { useRef, useState } from "octane";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useIntl } from "../../../hooks/useIntl";
import { DEFAULT_BOARD, Outlet, PANEL_IDS, expandedBoard, useRoute } from "../../../hooks/useRoute";
import { ExpandedPanel } from "./components/ExpandedPanel";
import { Panel } from "./components/Panel";
import { Stripe } from "./components/Stripe";
import { CLOSE_BY_PANEL, COLOR_TOKEN_BY_PANEL, TITLE_BY_PANEL, TONE_BY_PANEL } from "./config";
import { useBoardFocus } from "./hooks/useBoardFocus";
import { useThemeColor } from "./hooks/useThemeColor";
import styles from "./styles.module.css";

/**
 * The five Panels: all in their default look, or one of them expanded to show its page (the
 * route's `Outlet`) with the other four as Stripes.
 */
export function Board() @{
  const intl = useIntl();
  const { board, link, navigate } = useRoute();
  const expanded = board.kind === "expanded" ? board.panel : null;
  const root = useRef<HTMLElement>(null);
  // The Panels unfold whenever the Board mounts, whatever brought the Visitor here. Opening a
  // Panel ends it, so the Panels that come back on close do not replay it.
  const [unfolding, setUnfolding] = useState(true);

  if (expanded && unfolding) setUnfolding(false);
  useBoardFocus(expanded, root);
  useThemeColor(expanded && COLOR_TOKEN_BY_PANEL[expanded]);
  useDocumentTitle(
    expanded
      ? intl.formatMessage(
          { id: "board.expanded.documentTitle" },
          {
            panel: intl.formatMessage({ id: TITLE_BY_PANEL[expanded] }),
            site: intl.formatMessage({ id: "site.title" }),
          },
        )
      : intl.formatMessage({ id: "site.title" }),
  );

  <main ref={root} class={cx(styles["board"], expanded && styles["open"])}>
    <ul class={cx(styles["panels"], expanded && styles["open"])}>
      @for (const panel of PANEL_IDS; key panel) {
        @if (panel === expanded) {
          <ExpandedPanel
            tone={TONE_BY_PANEL[panel]}
            closeLabel={intl.formatMessage({ id: CLOSE_BY_PANEL[panel] })}
            onClose={() => navigate(DEFAULT_BOARD)}
          >
            <Outlet />
          </ExpandedPanel>;
        } @else if (expanded) {
          const { href, onClick } = link(expandedBoard(panel));
          <Stripe
            tone={TONE_BY_PANEL[panel]}
            title={intl.formatMessage({ id: TITLE_BY_PANEL[panel] })}
            href={href}
            onClick={onClick}
          />;
        } @else {
          <Panel panel={panel} tone={TONE_BY_PANEL[panel]} entering={unfolding} />;
        }
      }
    </ul>
  </main>;
}
