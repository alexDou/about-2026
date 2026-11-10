import cx from "classnames";
import { useRef, useState } from "octane";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useIntl } from "../../../hooks/useIntl";
import { BOARD_ROUTE, PANEL_IDS, panelRoute, useRoute } from "../../../hooks/useRoute";
import { ExpandedPanel } from "./components/ExpandedPanel";
import { Panel } from "./components/Panel";
import { Stripe } from "./components/Stripe";
import { CLOSE_BY_PANEL, COLOR_TOKEN_BY_PANEL, TITLE_BY_PANEL, TONE_BY_PANEL } from "./config";
import { useBoardFocus } from "./hooks/useBoardFocus";
import { useScrollReset } from "./hooks/useScrollReset";
import { useThemeColor } from "./hooks/useThemeColor";
import styles from "./styles.module.css";
import type { BoardProps } from "./types";

/**
 * The five Panels: all in their default look, or one of them expanded to show its page (the
 * children) with the other four as Stripes.
 */
export function Board({ board, children }: BoardProps) @{
  const intl = useIntl();
  const { userTriggered, link, navigate } = useRoute();
  const expanded = board.kind === "expanded" ? board.panel : null;
  const root = useRef<HTMLElement>(null);
  // Read once, at mount: a click on the Landing's logo is the only user action that mounts the
  // Board. A direct visit, a reload and Back/Forward arrive with `userTriggered` false and no entrance.
  const [entrance] = useState(userTriggered);
  // The Panels unfold once. Opening a Panel ends it, so the Panels that come back do not replay it.
  const [unfolding, setUnfolding] = useState(userTriggered);

  if (expanded && unfolding) setUnfolding(false);
  useBoardFocus(expanded, root);
  useScrollReset(expanded ?? "");
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

  <main
    ref={root}
    class={cx(styles["board"], entrance && styles["entrance"], expanded && styles["open"])}
  >
    <ul class={cx(styles["panels"], expanded && styles["open"])}>
      @for (const panel of PANEL_IDS; key panel) {
        @if (panel === expanded) {
          <ExpandedPanel
            tone={TONE_BY_PANEL[panel]}
            closeLabel={intl.formatMessage({ id: CLOSE_BY_PANEL[panel] })}
            onClose={() => navigate(BOARD_ROUTE)}
          >
            {children}
          </ExpandedPanel>;
        } @else if (expanded) {
          <Stripe
            tone={TONE_BY_PANEL[panel]}
            title={intl.formatMessage({ id: TITLE_BY_PANEL[panel] })}
            href={link(panelRoute(panel)).href}
            onClick={link(panelRoute(panel)).onClick}
          />;
        } @else {
          <Panel panel={panel} tone={TONE_BY_PANEL[panel]} entering={unfolding} />;
        }
      }
    </ul>
  </main>;
}
