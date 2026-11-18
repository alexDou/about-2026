import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { PortfolioWorld } from "../support/world.ts";

When("I open the Skill group {string}", async function (this: PortfolioWorld, name: string) {
  await this.page.getByRole("button", { name, exact: true }).click();
});

When("I click the Certificate link {string}", async function (this: PortfolioWorld, name: string) {
  await this.page.getByRole("button", { name, exact: true }).click();
});

When("I close the Certificate view", async function (this: PortfolioWorld) {
  await this.page.getByRole("dialog").getByRole("button", { name: "Close" }).click();
});

Then("the Certificate view {string} is open", async function (this: PortfolioWorld, title: string) {
  await expect(this.page.getByRole("dialog", { name: title })).toBeVisible();
});

Then(
  "the Certificate view {string} is closed",
  async function (this: PortfolioWorld, title: string) {
    await expect(this.page.getByRole("dialog", { name: title })).toBeHidden();
  },
);

Then("the Certificate image is shown", async function (this: PortfolioWorld) {
  const image = this.page.getByRole("dialog").getByRole("img");
  await expect(image).toBeVisible();
  // The browser loaded a file: the AVIF where it can, else the WebP.
  await expect
    .poll(() => image.evaluate((img: HTMLImageElement) => img.currentSrc))
    .toMatch(/\/certificates\/testdomePython\.(avif|webp)$/);
});
