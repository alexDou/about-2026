import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { PortfolioWorld } from "../support/world.ts";

const BAND_BACKGROUND = "rgb(209, 220, 217)";
const BAND_TEXT = "rgb(37, 54, 58)";

const band = (world: PortfolioWorld) => world.page.locator("main section > div").first();

/** The Contact items by their name in the scenario. */
const item = (world: PortfolioWorld, name: string) => {
  const items = {
    remote: band(world).getByText("Remote, worldwide"),
    links: band(world).getByRole("list"),
    form: band(world).locator(":scope > *").nth(2),
    notice: band(world).getByText("I use these details only"),
  } as const;
  return items[name as keyof typeof items];
};

const box = async (world: PortfolioWorld, name: string) => {
  const found = await item(world, name).boundingBox();
  if (!found) throw new Error(`The ${name} is not on screen`);
  return found;
};

Then("the Contact band is light with dark text", async function (this: PortfolioWorld) {
  await expect(band(this)).toHaveCSS("background-color", BAND_BACKGROUND);
  await expect(band(this)).toHaveCSS("color", BAND_TEXT);
});

Then("the Contact band says {string}", async function (this: PortfolioWorld, text: string) {
  await expect(band(this)).toContainText(text);
});

Then(
  "the Contact profile links are {string}",
  async function (this: PortfolioWorld, names: string) {
    const links = band(this).getByRole("list").getByRole("link");
    await expect(links).toHaveCount(names.split(", ").length);
    expect(await links.evaluateAll((all) => all.map((a) => a.getAttribute("aria-label")))).toEqual(
      names.split(", "),
    );
  },
);

Then(
  "the Contact left column stands beside the form column",
  async function (this: PortfolioWorld) {
    const form = await box(this, "form");
    for (const name of ["remote", "links", "notice"]) {
      const left = await box(this, name);
      expect(left.x + left.width).toBeLessThanOrEqual(form.x + 1);
    }
  },
);

Then(
  "the Contact items stack down the page in the order {string}",
  async function (this: PortfolioWorld, order: string) {
    const names = order.split(", ");
    const boxes = await Promise.all(names.map((name) => box(this, name)));
    for (const [i, current] of boxes.entries()) {
      const next = boxes[i + 1];
      if (next) expect(current.y + current.height).toBeLessThanOrEqual(next.y + 1);
    }
  },
);
