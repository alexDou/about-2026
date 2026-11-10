import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { PortfolioWorld } from "../support/world.ts";

const heading = (world: PortfolioWorld) => world.page.getByRole("heading", { level: 1 });
const closeButton = (world: PortfolioWorld, label: string) =>
  world.page.getByRole("button", { name: label });
const stripes = (world: PortfolioWorld) => world.page.getByRole("link");

When("I click the page heading", async function (this: PortfolioWorld) {
  await heading(this).click();
});

When("I click the close button {string}", async function (this: PortfolioWorld, label: string) {
  await closeButton(this, label).click();
});

When("I press Escape", async function (this: PortfolioWorld) {
  await this.page.keyboard.press("Escape");
});

When("the page content is {int}px tall", async function (this: PortfolioWorld, height: number) {
  // The pages are only headings for now: stretch one, to have a page long enough to scroll.
  await this.page.locator("section").evaluate((el, h) => (el.style.height = `${h}px`), height);
});

When("I scroll down {int}px", async function (this: PortfolioWorld, pixels: number) {
  await this.page.evaluate((y) => window.scrollTo(0, y), pixels);
  await expect.poll(() => this.page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

Then("the page heading reads {string}", async function (this: PortfolioWorld, text: string) {
  await expect(heading(this)).toHaveText(text);
});

Then("there is no page heading", async function (this: PortfolioWorld) {
  await expect(heading(this)).toHaveCount(0);
});

Then("the page heading has focus", async function (this: PortfolioWorld) {
  await expect(heading(this)).toBeFocused();
});

Then("the Panel {string} has focus", async function (this: PortfolioWorld, name: string) {
  await expect(this.page.getByRole("link", { name, exact: true })).toBeFocused();
});

Then("the other four Panels are Stripes", async function (this: PortfolioWorld) {
  await expect(stripes(this)).toHaveCount(4);
});

Then("the document title is {string}", async function (this: PortfolioWorld, title: string) {
  await expect(this.page).toHaveTitle(title);
});

Then("the theme colour is {string}", async function (this: PortfolioWorld, color: string) {
  await expect(this.page.locator('meta[name="theme-color"]')).toHaveAttribute("content", color);
});

Then(
  "the close button {string} has its icon hidden from screen readers",
  async function (this: PortfolioWorld, label: string) {
    const button = closeButton(this, label);
    await expect(button).toHaveAttribute("title", label);
    await expect(button.locator("svg")).toHaveAttribute("aria-hidden", "true");
  },
);

Then(
  "the Stripes are narrower than {int}px and run top to bottom",
  async function (this: PortfolioWorld, width: number) {
    for (const stripe of await stripes(this).all()) {
      const box = await stripe.boundingBox();
      expect(box?.width).toBeLessThan(width);
      expect(box!.height).toBeGreaterThan(box!.width);
      await expect(stripe).toHaveCSS("writing-mode", "vertical-rl");
    }
  },
);

Then("the Stripes and the close button are still in view", async function (this: PortfolioWorld) {
  const viewport = this.page.viewportSize()!;
  for (const stripe of await stripes(this).all()) {
    const box = await stripe.boundingBox();
    expect(box!.y).toBeCloseTo(0, 0);
    expect(box!.y + box!.height).toBeCloseTo(viewport.height, 0);
  }
  const close = await this.page.getByRole("button").boundingBox();
  expect(close!.y).toBeGreaterThanOrEqual(0);
  expect(close!.y + close!.height).toBeLessThanOrEqual(viewport.height);
});

Then("the page is at the top", async function (this: PortfolioWorld) {
  await expect.poll(() => this.page.evaluate(() => window.scrollY)).toBe(0);
});

Then(
  "the Stripes are rows at least 44px tall, with no Sublabel",
  async function (this: PortfolioWorld) {
    for (const stripe of await stripes(this).all()) {
      const box = await stripe.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.width).toBeGreaterThan(box!.height);
      await expect(stripe).toHaveCSS("writing-mode", "horizontal-tb");
    }
    await expect(this.page.locator("p")).toHaveCount(0);
    const top = await stripes(this).first().boundingBox();
    await this.page.evaluate(() => window.scrollTo(0, 40));
    // Not sticky: scrolling moves them (if the page can scroll at all, it is checked below).
    const scrolled = await this.page.evaluate(() => window.scrollY);
    const after = await stripes(this).first().boundingBox();
    expect(after!.y).toBeCloseTo(top!.y - scrolled, 0);
  },
);

Then("the Expanded panel fills the rest of the window", async function (this: PortfolioWorld) {
  const viewport = this.page.viewportSize()!;
  const panel = await this.page.getByRole("heading").locator("xpath=ancestor::li").boundingBox();
  const rows = await Promise.all((await stripes(this).all()).map((s) => s.boundingBox()));
  const stripeHeight = rows.reduce((sum, box) => sum + box!.height, 0);
  expect(panel!.height + stripeHeight).toBeGreaterThanOrEqual(viewport.height - 1);
});
