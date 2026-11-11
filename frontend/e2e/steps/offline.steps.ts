import { Given, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { PortfolioWorld } from "../support/world.ts";

/** The static server has no backend: each scenario says how `/api` answers. */
const API = "**/api/**";

const note = (world: PortfolioWorld) =>
  world.page.getByRole("status").filter({ hasText: "The backend is not reachable" });

Given("the backend is unreachable", async function (this: PortfolioWorld) {
  await this.page.route(API, async (route) => {
    await route.abort("connectionrefused");
    this.apiAnswers += 1;
  });
});

Given("the backend is up", async function (this: PortfolioWorld) {
  await this.page.route(API, async (route) => {
    await route.fulfill({ json: { status: "ok" } });
    this.apiAnswers += 1;
  });
});

Then("the offline note is shown", async function (this: PortfolioWorld) {
  await expect(note(this)).toBeVisible();
});

Then("there is no offline note", async function (this: PortfolioWorld) {
  // Only once the health check has had its answer does a missing note mean anything.
  await expect.poll(() => this.apiAnswers).toBeGreaterThan(0);
  await expect(note(this)).toHaveCount(0);
});

Then("the page has no place for an offline note", async function (this: PortfolioWorld) {
  // The note's status region is part of the page that has one, even while the backend is up.
  await expect(this.page.getByRole("status")).toHaveCount(0);
});
