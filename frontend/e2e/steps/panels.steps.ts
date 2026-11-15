import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { PortfolioWorld } from "../support/world.ts";

const heading = (world: PortfolioWorld) => world.page.getByRole("heading", { level: 1 });
const closeButton = (world: PortfolioWorld, label: string) =>
  world.page.getByRole("button", { name: label });
// The Stripes are the in-site links: a page may link elsewhere too (About's profiles, its CV file).
const stripes = (world: PortfolioWorld) =>
  world.page.getByRole("link").and(world.page.locator('a[href^="/"]:not([download])'));

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
  // Retried: while Explore's entrance plays the page is clipped and cannot scroll yet.
  await expect
    .poll(() =>
      this.page.evaluate((y) => {
        window.scrollTo(0, y);
        return window.scrollY;
      }, pixels),
    )
    .toBeGreaterThan(0);
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
  "the close button {string} is titled by its label",
  async function (this: PortfolioWorld, label: string) {
    await expect(closeButton(this, label)).toHaveAttribute("title", label);
  },
);

Then(
  "the close button is a target of at least {int} by {int} pixels",
  async function (this: PortfolioWorld, width: number, height: number) {
    const box = await this.page.getByRole("button", { name: /^Close / }).boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(width);
    expect(box!.height).toBeGreaterThanOrEqual(height);
  },
);

Then(
  "the close button sits in the Expanded panel's top-right corner",
  async function (this: PortfolioWorld) {
    // The visible top-right corner of the Expanded panel's slot: its right edge, and the window's
    // top once the page has scrolled (the button is sticky).
    const { button, slot } = await this.page
      .getByRole("button", { name: /^Close / })
      .evaluate((el) => ({
        button: el.getBoundingClientRect().toJSON() as DOMRect,
        slot: el.closest("li")!.getBoundingClientRect().toJSON() as DOMRect,
      }));
    expect(button.right).toBeCloseTo(slot.right, 0);
    expect(button.top).toBeCloseTo(Math.max(slot.top, 0), 0);
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

Then("the Stripes are still in view", async function (this: PortfolioWorld) {
  const viewport = this.page.viewportSize()!;
  for (const stripe of await stripes(this).all()) {
    const box = await stripe.boundingBox();
    expect(box!.y).toBeCloseTo(0, 0);
    expect(box!.y + box!.height).toBeCloseTo(viewport.height, 0);
  }
});

/** About's head, in the window: the close button, each badge, and the top card that follows the row. */
async function aboutHead(world: PortfolioWorld) {
  await expect(world.page.locator("main section ul").first()).toBeVisible();
  return world.page.evaluate(() => {
    const box = (el: Element) => {
      const { left, right, top, bottom, height } = el.getBoundingClientRect();
      return { left, right, top, bottom, height };
    };
    const row = document.querySelector("main section ul")!;
    return {
      close: box(document.querySelector('main button[aria-label^="Close"]')!),
      badges: [...row.children].map(box),
      card: box(row.nextElementSibling!),
      borderWidth: parseFloat(getComputedStyle(row.nextElementSibling!).borderTopWidth),
    };
  });
}

Then("the close button covers none of the badges", async function (this: PortfolioWorld) {
  const { close, badges } = await aboutHead(this);
  for (const badge of badges) {
    const apart =
      badge.right <= close.left ||
      badge.left >= close.right ||
      badge.bottom <= close.top ||
      badge.top >= close.bottom;
    expect(apart).toBe(true);
  }
});

Then("the six badges share one line", async function (this: PortfolioWorld) {
  const { badges } = await aboutHead(this);
  expect(badges).toHaveLength(6);
  for (const badge of badges) expect(badge.top).toBeCloseTo(badges[0]!.top, 0);
});

Then(
  "the top card's top border runs through the badges' middle",
  async function (this: PortfolioWorld) {
    const { badges, card, borderWidth } = await aboutHead(this);
    // The card's top border, whatever its thickness: its middle is half of it below the card's top.
    const borderMiddle = card.top + borderWidth / 2;
    const badgesMiddle = badges[0]!.top + badges[0]!.height / 2;
    expect(Math.abs(borderMiddle - badgesMiddle)).toBeLessThanOrEqual(1);
  },
);

Then("the badges sit in rows of three above the top card", async function (this: PortfolioWorld) {
  const { badges, card } = await aboutHead(this);
  const tops = badges.map((badge) => Math.round(badge.top));
  expect(new Set(tops.slice(0, 3)).size).toBe(1);
  expect(new Set(tops.slice(3)).size).toBe(1);
  expect(tops[3]).toBeGreaterThan(tops[0]!);
  expect(card.top).toBeGreaterThanOrEqual(Math.max(...badges.map((badge) => badge.bottom)));
});

Then("the page is still scrolled down", async function (this: PortfolioWorld) {
  // Not polled: the smooth scroll has only just begun when the click returns.
  expect(await this.page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
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

Then("the Stripes are taller than their title line", async function (this: PortfolioWorld) {
  const rows = await stripes(this).evaluateAll((links) =>
    links.map((link) => {
      // `line-height: normal` has no number to read: measure the slot's line box (`1lh`, which
      // sizes it).
      const slot = link.closest("li")!;
      const probe = document.createElement("span");
      probe.style.cssText = "display: block; height: 1lh";
      slot.append(probe);
      const line = probe.getBoundingClientRect().height;
      probe.remove();
      return { height: slot.getBoundingClientRect().height, line };
    }),
  );
  // How much room the title has around it is a style detail: only that it has some.
  for (const { height, line } of rows) expect(height).toBeGreaterThan(line);
});
