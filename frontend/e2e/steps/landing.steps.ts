import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { PortfolioWorld } from "../support/world.ts";

Then("the page title is {string}", async function (this: PortfolioWorld, title: string) {
  await expect(this.page).toHaveTitle(title);
});

Then("the page logs no errors", async function (this: PortfolioWorld) {
  await this.page.waitForLoadState("networkidle");
  expect(this.pageErrors).toEqual([]);
});
