import { act, fireEvent, render } from "@octanejs/testing-library";
import { createElement } from "octane";
import { intlWrapper } from "../../../../i18n";
import { PANEL_IDS, RouterProvider, testRouter } from "../../../../hooks/useRoute";
import { Board } from "../Board.tsrx";

const page = () => createElement("p", null, "The page");
const pages = Object.fromEntries(PANEL_IDS.map((panel) => [panel, page]));

/** Shows the Board at `path`, as the site does: the route's page in the Board's `Outlet`. */
export async function renderBoardAt(path: string, messages?: Parameters<typeof intlWrapper>[0]) {
  window.history.replaceState(null, "", path);
  const router = testRouter({ board: Board, pages });
  const view = render(RouterProvider, { props: { router }, wrapper: intlWrapper(messages) });
  await act(() => router.load());
  return view;
}

/** Clicks `target`; reports whether the app took the click, and stops jsdom "following" the link. */
export function clickHandledByApp(target: HTMLElement, init: MouseEventInit = {}): boolean {
  let handled = false;
  const observe = (event: Event) => {
    handled = event.defaultPrevented;
    event.preventDefault();
  };
  document.addEventListener("click", observe, { once: true });
  fireEvent.click(target, init);
  return handled;
}
