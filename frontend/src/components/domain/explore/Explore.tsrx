import "octane/signals";
import { useRef } from "octane";
import { useDocumentTitle } from "../../../hooks/use-document-title";
import { useIntl } from "../../../hooks/use-intl";
import {
  EXPLORE_KIND,
  DEFAULT_EXPLORE,
  Outlet,
  PANEL_IDS,
  expandedExplore,
  useRoute,
} from "../../../hooks/use-route";
import { ExpandedPanel } from "./expanded-panel";
import { Panel } from "./panel";
import { Slot } from "./slot";
import { Stripe } from "./stripe";
import { CLOSE_BY_PANEL, COLOR_TOKEN_BY_PANEL, TITLE_BY_PANEL, TONE_BY_PANEL } from "./config";
import { useExploreFocus } from "./hooks/use-explore-focus";
import { busy$ } from "./motion";
import { useExploreSync } from "./hooks/use-explore-sync";
import { useThemeColor } from "./hooks/use-theme-color";
import styles from "./styles.module.css";
import { ignoredWhileBusy, scrollingUpFirst, viewOf } from "./utils";

/**
 * The five Panels, each in its own slot: all in their default look, or one of them expanded to
 * show its page (the route's `Outlet`) with the other four as Stripes. A change of route plays as
 * a View Transition (see the slots); the document follows the route at once.
 */
export function Explore() @{
  const intl = useIntl();
  const { explore, link, navigate } = useRoute();
  const expanded = explore.kind === EXPLORE_KIND.expanded ? explore.panel : null;
  const root = useRef<HTMLElement>(null);
  useExploreSync(explore);
  // The route decides what Explore shows. The router wraps each navigation in a View Transition
  // (`exploreViewTransition`), and the Slot's stylesheet animates it.
  // Explore ignores clicks while its entrance plays and while the page scrolls up.
  const busy = busy$.get();

  // The close button and Escape do nothing while Explore is busy.
  function close() {
    if (!busy) navigate(DEFAULT_EXPLORE);
  }

  useExploreFocus(expanded, root);
  useThemeColor(expanded && COLOR_TOKEN_BY_PANEL[expanded]);
  useDocumentTitle(
    expanded
      ? intl.formatMessage(
          { id: "explore.expanded.documentTitle" },
          {
            panel: intl.formatMessage({ id: TITLE_BY_PANEL[expanded] }),
            site: intl.formatMessage({ id: "site.title" }),
          },
        )
      : intl.formatMessage({ id: "site.title" }),
  );

  <main ref={root} class={styles["explore"]}>
    <ul class={styles["explore__panels"]}>
      @for (const panel of PANEL_IDS; key panel) {
        const { href, onClick } = link(expandedExplore(panel));
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
                scrollingUpFirst(onClick, () => navigate(expandedExplore(panel))),
              )}
            />;
          }
        </Slot>;
      }
    </ul>
  </main>;
}
