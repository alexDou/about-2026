import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { Locator } from "@playwright/test";
import type { PortfolioWorld } from "../support/world.ts";

/** The title link of a Panel, and the Panel (list item) around it. */
const title = (world: PortfolioWorld, name: string): Locator =>
  world.page.getByRole("link", { name, exact: true });
const panel = (world: PortfolioWorld, name: string): Locator =>
  title(world, name).locator("xpath=ancestor::li");
const panels = (world: PortfolioWorld): Locator => world.page.getByRole("listitem");

const boxes = async (locator: Locator) =>
  Promise.all((await locator.all()).map((item) => item.boundingBox()));

const close = (actual: number | undefined, expected: number) =>
  expect(actual).toBeCloseTo(expected, 0);

Given(
  "the window is {int} by {int}",
  async function (this: PortfolioWorld, width: number, height: number) {
    await this.page.setViewportSize({ width, height });
  },
);

Then(
  "the Panel {string} is coloured {string} with text {string}",
  async function (this: PortfolioWorld, name: string, background: string, text: string) {
    await expect(panel(this, name)).toHaveCSS("background-color", background);
    await expect(panel(this, name)).toHaveCSS("color", text);
    await expect(title(this, name)).toHaveCSS("color", text);
  },
);

Then(
  "every Panel title is uppercase, spaced wide, at least 24px and in {string}",
  async function (this: PortfolioWorld, family: string) {
    for (const link of await this.page.getByRole("link").all()) {
      await expect(link).toHaveCSS("text-transform", "uppercase");
      await expect(link).toHaveCSS("font-family", new RegExp(`^"?${family}"?,`));
      const { size, spacing } = await link.evaluate((el) => {
        const style = getComputedStyle(el);
        return { size: parseFloat(style.fontSize), spacing: parseFloat(style.letterSpacing) };
      });
      expect(size).toBeGreaterThanOrEqual(24);
      expect(spacing).toBeGreaterThanOrEqual(size * 0.1);
    }
  },
);

Then(
  "the Sublabels read {string} and {string}",
  async function (this: PortfolioWorld, first: string, second: string) {
    await expect(this.page.locator("p")).toHaveText([first, second]);
  },
);

Then("the Sublabels are not links", async function (this: PortfolioWorld) {
  await expect(this.page.locator("a p, p a")).toHaveCount(0);
});

Then(
  "the Panels are {int} equal columns filling the window",
  async function (this: PortfolioWorld, count: number) {
    const viewport = this.page.viewportSize()!;
    const items = await boxes(panels(this));
    expect(items).toHaveLength(count);
    items.forEach((box, index) => {
      close(box?.width, viewport.width / count);
      close(box?.height, viewport.height);
      close(box?.x, (viewport.width / count) * index);
    });
  },
);

Then(
  "the Panels are {int} equal rows filling the window",
  async function (this: PortfolioWorld, count: number) {
    const viewport = this.page.viewportSize()!;
    const items = await boxes(panels(this));
    expect(items).toHaveLength(count);
    items.forEach((box, index) => {
      close(box?.width, viewport.width);
      close(box?.height, viewport.height / count);
      close(box?.y, (viewport.height / count) * index);
    });
  },
);

Then("every Panel title is centred in its Panel", async function (this: PortfolioWorld) {
  for (const item of await panels(this).all()) {
    const outer = (await item.boundingBox())!;
    const inner = (await item.getByRole("link").boundingBox())!;
    expect(Math.abs(inner.x + inner.width / 2 - (outer.x + outer.width / 2))).toBeLessThan(2);
    expect(Math.abs(inner.y + inner.height / 2 - (outer.y + outer.height / 2))).toBeLessThan(2);
  }
});

Then("the Board is at least {int}px tall", async function (this: PortfolioWorld, min: number) {
  const box = (await this.page.getByRole("main").boundingBox())!;
  expect(box.height).toBeGreaterThanOrEqual(min);
});

Then("every Panel is at least {int}px tall", async function (this: PortfolioWorld, min: number) {
  for (const box of await boxes(panels(this))) expect(box!.height).toBeGreaterThanOrEqual(min);
});

Then("every Panel title fits inside its Panel", async function (this: PortfolioWorld) {
  for (const item of await panels(this).all()) {
    const outer = (await item.boundingBox())!;
    const inner = (await item.getByRole("link").boundingBox())!;
    expect(inner.x).toBeGreaterThanOrEqual(outer.x);
    expect(inner.x + inner.width).toBeLessThanOrEqual(outer.x + outer.width);
  }
});

Then("every Sublabel fits inside its Panel", async function (this: PortfolioWorld) {
  for (const item of await panels(this).all()) {
    const sublabel = item.locator("p");
    if ((await sublabel.count()) === 0) continue;
    const outer = (await item.boundingBox())!;
    const inner = (await sublabel.boundingBox())!;
    expect(inner.x).toBeGreaterThanOrEqual(outer.x);
    expect(inner.x + inner.width).toBeLessThanOrEqual(outer.x + outer.width);
    expect(inner.y + inner.height).toBeLessThanOrEqual(outer.y + outer.height);
  }
});

/** The pen's line is the title's `::before`. */
const lineOpacity = (link: Locator) =>
  link.evaluate((el) => parseFloat(getComputedStyle(el, "::before").opacity));

Then(
  "the line of the Panel title {string} is hidden",
  async function (this: PortfolioWorld, name: string) {
    await expect.poll(() => lineOpacity(title(this, name))).toBe(0);
  },
);

Then(
  "the line of the Panel title {string} is shown",
  async function (this: PortfolioWorld, name: string) {
    await expect.poll(() => lineOpacity(title(this, name))).toBe(1);
  },
);

When("I hover the Panel title {string}", async function (this: PortfolioWorld, name: string) {
  await title(this, name).hover();
});

When("I move the pointer away", async function (this: PortfolioWorld) {
  await this.page.mouse.move(0, 0);
});

When(
  "I focus the Panel title {string} with the keyboard",
  async function (this: PortfolioWorld, name: string) {
    // Tab until the title has focus: `:focus-visible` needs keyboard focus.
    for (let presses = 0; presses < 10; presses++) {
      await this.page.keyboard.press("Tab");
      if (await title(this, name).evaluate((el) => el === document.activeElement)) return;
    }
    throw new Error(`Tab never reached the Panel title "${name}"`);
  },
);
