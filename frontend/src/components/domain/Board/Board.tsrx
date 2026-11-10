import { useRef, useState } from "octane";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useIntl } from "../../../hooks/useIntl";
import { DEFAULT_BOARD, Outlet, PANEL_IDS, expandedBoard, useRoute } from "../../../hooks/useRoute";
import { ExpandedPanel } from "./components/ExpandedPanel";
import { Panel } from "./components/Panel";
import { Slot } from "./components/Slot";
import { Stripe } from "./components/Stripe";
import { CLOSE_BY_PANEL, COLOR_TOKEN_BY_PANEL, TITLE_BY_PANEL, TONE_BY_PANEL } from "./config";
import { useBoardFocus } from "./hooks/useBoardFocus";
import { useBoardSequence } from "./hooks/useBoardSequence";
import { useThemeColor } from "./hooks/useThemeColor";
import styles from "./styles.module.css";
import { ignoredWhileBusy, viewOf } from "./utils";

/**
 * The five Panels, each in its own slot: all in their default look, or one of them expanded to
 * show its page (the route's `Outlet`) with the other four as Stripes. A change of route plays as
 * a sequence of stages (`useBoardSequence`); the document follows the route at once.
 */
export function Board() @{
  const intl = useIntl();
  const { board, link, navigate } = useRoute();
  const expanded = board.kind === "expanded" ? board.panel : null;
  const root = useRef<HTMLElement>(null);
  const { stage, busy } = useBoardSequence(board, root);
  // The Panels unfold whenever the Board mounts, whatever brought the Visitor here. Opening a
  // Panel ends it, so the Panels that come back on close do not replay it.
  const [unfolding, setUnfolding] = useState(true);

  // The close button and Escape do nothing while a sequence runs.
  function close() {
    if (!busy) navigate(DEFAULT_BOARD);
  }

  if (stage.layout !== null && unfolding) setUnfolding(false);
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
          tone={TONE_BY_PANEL[panel]}
          view={viewOf(stage, panel)}
          shown={stage.views !== "none"}
          entering={unfolding}
        >
          @if (stage.layout === null) {
            <Panel
              panel={panel}
              href={href}
              onClick={ignoredWhileBusy(busy, onClick)}
              entering={unfolding}
            />;
          } @else if (stage.layout === panel) {
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
              onClick={ignoredWhileBusy(busy, onClick)}
            />;
          }
        </Slot>;
      }
    </ul>
  </main>;
}
