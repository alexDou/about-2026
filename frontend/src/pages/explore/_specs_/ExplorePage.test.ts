import { act, render, screen, within } from "@octanejs/testing-library";
import { createElement } from "octane";
import { afterEach, describe, expect, it } from "vitest";
import { intlWrapper } from "../../../i18n";
import { PANEL_IDS, RouterProvider, testRouter } from "../../../hooks/use-route";
import { ExplorePage } from "../ExplorePage.tsrx";

const page = () => createElement("p", null, "The page");
const pages = Object.fromEntries(PANEL_IDS.map((panel) => [panel, page]));

async function renderAt(path: string) {
  window.history.replaceState(null, "", path);
  const router = testRouter({ explore: ExplorePage, pages });
  render(RouterProvider, { props: { router }, wrapper: intlWrapper() });
  await act(() => router.load());
}

describe("ExplorePage", () => {
  afterEach(() => window.history.replaceState(null, "", "/"));

  it("shows Explore with its five Panels at /explore", async () => {
    await renderAt("/explore");
    expect(within(screen.getByRole("main")).getAllByRole("link")).toHaveLength(5);
  });

  it("shows the Expanded panel's page at a Panel's URL", async () => {
    await renderAt("/about");
    expect(within(screen.getByRole("main")).getByText("The page")).toBeInTheDocument();
  });
});
