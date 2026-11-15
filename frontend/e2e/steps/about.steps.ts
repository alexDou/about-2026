import { readFile } from "node:fs/promises";
import { Then, When } from "@cucumber/cucumber";
import type { DataTable } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { PortfolioWorld } from "../support/world.ts";

const PLACEHOLDER = /\b(lorem|ipsum|placeholder|todo|tbd|fixme|xxx)\b/i;

const topCard = (world: PortfolioWorld) => world.page.locator("main article").first();
const badgeImages = (world: PortfolioWorld) => world.page.locator("main ul > li > svg[role=img]");

Then("the top card says {string}", async function (this: PortfolioWorld, text: string) {
  await expect(topCard(this)).toContainText(text);
});

Then("the photo {string} is shown", async function (this: PortfolioWorld, alt: string) {
  const photo = topCard(this).getByRole("img", { name: alt });
  await expect(photo).toBeVisible();
  // Decoded, not only in the page: a broken file has no width.
  await expect
    .poll(() => photo.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0);
});

Then("the badges read and are titled:", async function (this: PortfolioWorld, table: DataTable) {
  const expected = table.raw();
  const badges = badgeImages(this);
  await expect(badges).toHaveCount(expected.length);
  const actual = await badges.evaluateAll((svgs) =>
    svgs.map((svg) => [svg.getAttribute("aria-label"), svg.querySelector("title")?.textContent]),
  );
  expect(actual).toEqual(expected);
});

Then(
  "the cards are headed in order {string}",
  async function (this: PortfolioWorld, headings: string) {
    const level2 = this.page.locator("main").getByRole("heading", { level: 2 });
    await expect(level2).toHaveText(headings.split(", "));
  },
);

Then("the Roles are listed in order:", async function (this: PortfolioWorld, table: DataTable) {
  const titles = this.page.locator("main ol > li").getByRole("heading", { level: 3 });
  await expect(titles).toHaveText(table.raw().flat());
});

Then(
  "the badges, the photo and the Bio card follow each other down the page",
  async function (this: PortfolioWorld) {
    const viewport = this.page.viewportSize()!;
    const photo = topCard(this).getByRole("img", { name: "Alexander Durnev" });
    const bio = this.page.getByRole("heading", { name: "Bio", level: 2 });
    await expect(photo).toBeVisible();
    // Polled: images decode and the layout settles after the first paint.
    await expect
      .poll(async () => {
        const badges = await badgeImages(this).evaluateAll((svgs) =>
          svgs.map((svg) => {
            const { left, right, bottom } = svg.getBoundingClientRect();
            return { left, right, bottom };
          }),
        );
        const photoBox = await photo.boundingBox();
        const bioBox = await bio.boundingBox();
        if (!photoBox || !bioBox) return false;
        return (
          badges.length === 6 &&
          badges.every((badge) => badge.left >= 0 && badge.right <= viewport.width) &&
          Math.max(...badges.map((badge) => badge.bottom)) <= photoBox.y &&
          photoBox.y + photoBox.height <= bioBox.y
        );
      })
      .toBe(true);
  },
);

When("I click the link {string}", async function (this: PortfolioWorld, name: string) {
  [this.download] = await Promise.all([
    this.page.waitForEvent("download"),
    this.page.getByRole("link", { name }).click(),
  ]);
});

Then("the browser downloads {string}", async function (this: PortfolioWorld, filename: string) {
  expect(this.download?.suggestedFilename()).toBe(filename);
  // A real PDF, not an HTML fallback served for a missing file.
  const path = await this.download?.path();
  expect(path).toBeTruthy();
  expect((await readFile(path!)).subarray(0, 5).toString()).toBe("%PDF-");
});

Then("About shows no placeholder text", async function (this: PortfolioWorld) {
  const main = this.page.locator("main");
  await expect(main.getByRole("heading", { level: 2 }).first()).toBeVisible();
  expect(await main.innerText()).not.toMatch(PLACEHOLDER);
  const titles = await badgeImages(this).evaluateAll((svgs) =>
    svgs.map((svg) => svg.querySelector("title")?.textContent ?? ""),
  );
  for (const title of titles) expect(title).not.toMatch(PLACEHOLDER);
  const labels = await main
    .locator("[alt], [aria-label]")
    .evaluateAll((els) =>
      els.map((el) => el.getAttribute("alt") ?? el.getAttribute("aria-label") ?? ""),
    );
  for (const label of labels) expect(label).not.toMatch(PLACEHOLDER);
});
