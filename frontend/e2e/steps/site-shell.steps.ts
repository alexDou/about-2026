import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { PortfolioWorld } from "../support/world.ts";

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

When("I fetch {string}", async function (this: PortfolioWorld, path: string) {
  const response = await fetch(this.url(path));
  expect(response.status).toBe(200);
  this.fetchedText = await response.text();
});

Then("the response contains {string}", function (this: PortfolioWorld, text: string) {
  expect(this.fetchedText).toContain(text);
});

Then("the page asks robots for {string}", async function (this: PortfolioWorld, content: string) {
  await expect(this.page.locator('meta[name="robots"]')).toHaveAttribute("content", content);
});

Then(
  "the response disallows {string} and {string}",
  function (this: PortfolioWorld, first: string, second: string) {
    for (const agent of [first, second])
      expect(this.fetchedText).toMatch(
        new RegExp(`User-agent: ${agent}\\n(?:User-agent: .*\\n)*Disallow: /\\n`),
      );
  },
);

Then("the response lets {string} in", function (this: PortfolioWorld, agent: string) {
  expect(this.fetchedText).toMatch(new RegExp(`User-agent: ${escapeRegExp(agent)}\\nDisallow:\\n`));
});

Then("the page text is set in {string}", async function (this: PortfolioWorld, family: string) {
  await expect(this.page.locator("body")).toHaveCSS("font-family", new RegExp(`^"?${family}"?,`));
});

Then("the font {string} has loaded", async function (this: PortfolioWorld, family: string) {
  await expect
    .poll(() => this.page.evaluate((f) => document.fonts.check(`16px "${f}"`), family))
    .toBe(true);
});
