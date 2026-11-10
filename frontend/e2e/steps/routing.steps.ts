import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { PortfolioWorld } from "../support/world.ts";

const PANEL_TITLES = ["About", "What I do", "Skills", "Chat with me", "Contact"];

When("I open {string}", async function (this: PortfolioWorld, path: string) {
  await this.page.goto(this.url(path));
});

When("I go back", async function (this: PortfolioWorld) {
  await this.page.goBack();
});

When("I go forward", async function (this: PortfolioWorld) {
  await this.page.goForward();
});

When("I mark the document to detect a reload", async function (this: PortfolioWorld) {
  await this.page.evaluate(() => {
    (window as unknown as { reloadMarker: boolean }).reloadMarker = true;
  });
});

When("I click the Panel {string}", async function (this: PortfolioWorld, title: string) {
  await this.page.getByRole("link", { name: title }).click();
});

Then("I am on {string}", async function (this: PortfolioWorld, path: string) {
  await expect.poll(() => new URL(this.page.url()).pathname).toBe(path);
});

Then("the logo is shown", async function (this: PortfolioWorld) {
  await expect(this.page.getByRole("button", { name: "Portfolio A.Durnev" })).toBeVisible();
});

Then("the Board lists the five Panels", async function (this: PortfolioWorld) {
  await expect(this.page.getByRole("link")).toHaveText(PANEL_TITLES);
});

Then(
  "the Panel {string} links to {string}",
  async function (this: PortfolioWorld, title: string, href: string) {
    await expect(this.page.getByRole("link", { name: title })).toHaveAttribute("href", href);
  },
);

Then("the document was not reloaded", async function (this: PortfolioWorld) {
  expect(
    await this.page.evaluate(() => (window as unknown as { reloadMarker?: boolean }).reloadMarker),
  ).toBe(true);
});
