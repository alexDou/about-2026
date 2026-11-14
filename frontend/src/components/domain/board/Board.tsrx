import "octane/signals";
import { useRef } from "octane";
import { useDocumentTitle } from "../../../hooks/use-document-title";
import { useIntl } from "../../../hooks/use-intl";
import {
  BOARD_KIND,
  DEFAULT_BOARD,
  Outlet,
  PANEL_IDS,
  expandedBoard,
  useRoute,
} from "../../../hooks/use-route";
import { ExpandedPanel } from "./components/expanded-panel";
import { Panel } from "./components/panel";
import { Slot } from "./components/slot";
import { Stripe } from "./components/stripe";
import { CLOSE_BY_PANEL, COLOR_TOKEN_BY_PANEL, TITLE_BY_PANEL, TONE_BY_PANEL } from "./config";
import { useBoardFocus } from "./hooks/use-board-focus";
import { busy$ } from "./motion";
import { useBoardSync } from "./hooks/use-board-sync";
import { useThemeColor } from "./hooks/use-theme-color";
import styles from "./styles.module.css";
import { ignoredWhileBusy, scrollingUpFirst, viewOf } from "./utils";

/**
 * The five Panels, each in its own slot: all in their default look, or one of them expanded to
 * show its page (the route's `Outlet`) with the other four as Stripes. A change of route plays as
 * a View Transition (see the slots); the document follows the route at once.
 */
export function Board() @{
  const intl = useIntl();
  const { board, link, navigate } = useRoute();
  const expanded = board.kind === BOARD_KIND.expanded ? board.panel : null;
  const root = useRef<HTMLElement>(null);
  useBoardSync(board);
  // The route decides what the Board shows. The router wraps each navigation in a View Transition
  // (`boardViewTransition`), and the Slot's stylesheet animates it.
  // The Board ignores clicks while its entrance plays and while the page scrolls up.
  const busy = busy$.get();

  // The close button and Escape do nothing while the Board is busy.
  function close() {
    if (!busy) navigate(DEFAULT_BOARD);
  }

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

  <main ref={root} class={styles["board"]}>
    <ul class={styles["board__panels"]}>
      @for (const panel of PANEL_IDS; key panel) {
        const { href, onClick } = link(expandedBoard(panel));
        <Slot tone={TONE_BY_PANEL[panel]} view={viewOf(expanded, panel)}>
          @if (expanded === null) {
            <Panel
              panel={panel}
              href={href}
              onClick={ignoredWhileBusy(busy, onClick)}
            />;
          } @else if (expanded === panel) {
            <ExpandedPanel
              closeLabel={intl.formatMessage({ id: CLOSE_BY_PANEL[panel] })}
              onClose={close}
            >
              <Outlet />
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
