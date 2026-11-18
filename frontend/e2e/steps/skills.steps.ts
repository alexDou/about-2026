import { Given, Then, When } from "@cucumber/cucumber";
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

Given("the visitor lets the page use the clipboard", async function (this: PortfolioWorld) {
  await this.context.grantPermissions(["clipboard-read", "clipboard-write"]);
});

When("I click the button {string}", async function (this: PortfolioWorld, name: string) {
  await this.page.getByRole("button", { name, exact: true }).click();
});

Then(
  "{string} is announced in the status region",
  async function (this: PortfolioWorld, text: string) {
    await expect(this.page.getByRole("status").filter({ hasText: text })).toBeVisible();
  },
);

Then("the clipboard starts with the Skills text", async function (this: PortfolioWorld) {
  const text = await this.page.evaluate(() => navigator.clipboard.readText());
  expect(text.split("\n").slice(0, 3)).toEqual([
    "Programming languages",
    "  TypeScript",
    "    Expert, working confidently with complex types and interfaces.",
  ]);
});

When("I close the Skill group {string}", async function (this: PortfolioWorld, name: string) {
  await this.page.getByRole("button", { name, exact: true }).click();
});

Then("the button {string} is shown", async function (this: PortfolioWorld, name: string) {
  await expect(this.page.getByRole("button", { name, exact: true })).toBeVisible();
});

Then(
  "the Skill groups, in order, are:",
  async function (this: PortfolioWorld, table: { raw(): string[][] }) {
    const names = table.raw().flat();
    await expect(this.page.getByRole("heading", { level: 2 })).toHaveText(names);
  },
);

const GROUP_BUTTONS = 'button[aria-controls^="skill-group-"]';
const OVERVIEW_BUTTONS = 'button[aria-controls^="skill-overview-"]';

/** Every button matching `selector` has `aria-expanded` = `expanded`: counted with retries. */
async function expectAllExpanded(world: PortfolioWorld, selector: string, expanded: boolean) {
  await expect(world.page.locator(selector)).not.toHaveCount(0);
  await expect(world.page.locator(`${selector}[aria-expanded="${!expanded}"]`)).toHaveCount(0);
}

Then("every Skill group is collapsed", async function (this: PortfolioWorld) {
  await expect(this.page.locator(GROUP_BUTTONS)).toHaveCount(8);
  await expectAllExpanded(this, GROUP_BUTTONS, false);
});

Then("every Skill group is expanded", async function (this: PortfolioWorld) {
  await expect(this.page.locator(GROUP_BUTTONS)).toHaveCount(8);
  await expectAllExpanded(this, GROUP_BUTTONS, true);
});

Then("every overview is expanded", async function (this: PortfolioWorld) {
  await expectAllExpanded(this, OVERVIEW_BUTTONS, true);
});

Then("every overview is collapsed", async function (this: PortfolioWorld) {
  await expectAllExpanded(this, OVERVIEW_BUTTONS, false);
});

When("I open every Skill group by hand", async function (this: PortfolioWorld) {
  for (const button of await this.page.locator(GROUP_BUTTONS).all()) await button.click();
});

Then("{string} is expanded", async function (this: PortfolioWorld, name: string) {
  await expect(this.page.getByRole("button", { name, exact: true })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});

Then("{string} is collapsed", async function (this: PortfolioWorld, name: string) {
  await expect(this.page.getByRole("button", { name, exact: true })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

Then("the Skill {string} is shown", async function (this: PortfolioWorld, name: string) {
  await expect(this.page.getByText(name, { exact: true }).first()).toBeVisible();
});

Then("the Skill {string} is out of sight", async function (this: PortfolioWorld, name: string) {
  const skill = this.page.getByText(name, { exact: true }).first();
  await expect(skill).toBeAttached();
  await expect(skill).toBeHidden();
});

Then("the Skills text has no placeholder", async function (this: PortfolioWorld) {
  const text = await this.page.locator("main").innerText();
  expect(text).not.toMatch(/\b(lorem|placeholder|todo|tbd)\b/i);
  // A message id shown as text means a message is missing.
  expect(text).not.toMatch(/\bskills\.[A-Za-z]+\./);
});

Then("the clipboard has the line {string}", async function (this: PortfolioWorld, line: string) {
  const text = await this.page.evaluate(() => navigator.clipboard.readText());
  expect(text.split("\n")).toContain(line);
});
