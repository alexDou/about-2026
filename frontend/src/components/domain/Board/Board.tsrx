import "octane/signals";
import { useRef } from "octane";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useIntl } from "../../../hooks/useIntl";
import {
  BOARD_KIND,
  DEFAULT_BOARD,
  Outlet,
  PANEL_IDS,
  expandedBoard,
  useRoute,
} from "../../../hooks/useRoute";
import { ExpandedPanel } from "./components/ExpandedPanel";
import { Panel } from "./components/Panel";
import { Slot } from "./components/Slot";
import { Stripe } from "./components/Stripe";
import {
  CLOSE_BY_PANEL,
  COLOR_TOKEN_BY_PANEL,
  STAGE_VIEWS,
  TITLE_BY_PANEL,
  TONE_BY_PANEL,
} from "./config";
import { useBoardFocus } from "./hooks/useBoardFocus";
import { busy$, settledStage, stage$ } from "./motion";
import { useBoardSync } from "./hooks/useBoardSync";
import { useThemeColor } from "./hooks/useThemeColor";
import styles from "./styles.module.css";
import { ignoredWhileBusy, scrollingUpFirst, viewOf } from "./utils";

/**
 * The five Panels, each in its own slot: all in their default look, or one of them expanded to
 * show its page (the route's `Outlet`) with the other four as Stripes. A change of route plays as
 * a sequence of stages (`motion/`); the document follows the route at once.
 */
export function Board() @{
  const intl = useIntl();
  const { board, link, navigate } = useRoute();
  const expanded = board.kind === BOARD_KIND.expanded ? board.panel : null;
  const root = useRef<HTMLElement>(null);
  useBoardSync(board);
  // The route decides what the Board shows until its motion is on its way: a visit to any URL
  // shows that URL's stage at once.
  const stage = stage$.get() ?? settledStage(board);
  // The Board ignores clicks while its entrance plays and while a sequence runs.
  const busy = busy$.get();

  // The close button and Escape do nothing while the Board is busy.
  function close() {
    if (!busy) navigate(DEFAULT_BOARD);
  }

  useBoardFocus(stage, root);
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

  <main ref={root} class={styles["board"]}>
    <ul class={styles["panels"]}>
      @for (const panel of PANEL_IDS; key panel) {
        const { href, onClick } = link(expandedBoard(panel));
        <Slot
          panel={panel}
          tone={TONE_BY_PANEL[panel]}
          view={viewOf(stage, panel)}
          shown={stage.views !== STAGE_VIEWS.none}
        >
          @if (stage.layout === null) {
            <Panel
              panel={panel}
              href={href}
              onClick={ignoredWhileBusy(busy, onClick)}
            />;
          } @else if (stage.layout === panel) {
            <ExpandedPanel
              closeLabel={intl.formatMessage({ id: CLOSE_BY_PANEL[panel] })}
              onClose={close}
            >
              // The route's page belongs in the slot the route names. The stage follows the
              // route a frame later, so on a switch the old slot must not show the new page.
              @if (expanded === panel) {
                <Outlet />;
              }
            </ExpandedPanel>;
          } @else {
            <Stripe
              title={intl.formatMessage({ id: TITLE_BY_PANEL[panel] })}
              href={href}
              onClick={ignoredWhileBusy(
                busy,
                scrollingUpFirst(onClick, () => navigate(expandedBoard(panel))),
              )}
            />;
          }
        </Slot>;
      }
    </ul>
  </main>;
}
