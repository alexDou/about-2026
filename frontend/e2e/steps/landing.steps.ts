import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { PortfolioWorld } from "../support/world.ts";

Then("I see the heading {string}", async function (this: PortfolioWorld, name: string) {
  await expect(this.page.getByRole("heading", { name })).toBeVisible();
});
