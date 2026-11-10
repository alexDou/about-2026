import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { PortfolioWorld } from "../support/world.ts";

const logo = (world: PortfolioWorld) =>
  world.page.getByRole("button", { name: "Portfolio A.Durnev" });

const hexToRgb = (hex: string) => {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
};

Given("I open the landing page", async function (this: PortfolioWorld) {
  await this.page.goto(this.url("/"));
});

When("I hover over the logo", async function (this: PortfolioWorld) {
  await logo(this).hover();
});

When("I click the logo", async function (this: PortfolioWorld) {
  await logo(this).click();
});

Then("the logo shows a pointer cursor", async function (this: PortfolioWorld) {
  await expect(logo(this)).toHaveCSS("cursor", "pointer");
});

Then("the logo ring uses the color {string}", async function (this: PortfolioWorld, hex: string) {
  // First ring tone; the hover palette fades in over 0.4s, so poll until it settles.
  const firstRingPath = logo(this).locator('[data-part="ring"] path').first();
  await expect(firstRingPath).toHaveCSS("stroke", hexToRgb(hex));
});

Then("the logo weave moves over time", async function (this: PortfolioWorld) {
  const path = logo(this).locator('[data-part="ring"] path').first();
  const before = await path.getAttribute("d");
  await expect.poll(() => path.getAttribute("d")).not.toBe(before);
});
