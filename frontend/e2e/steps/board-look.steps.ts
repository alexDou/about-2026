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
  "every Panel title is uppercase, spaced wide, 16px and in {string}",
  async function (this: PortfolioWorld, family: string) {
    for (const link of await this.page.getByRole("link").all()) {
      await expect(link).toHaveCSS("text-transform", "uppercase");
      await expect(link).toHaveCSS("font-family", new RegExp(`^"?${family}"?,`));
      const { size, spacing } = await link.evaluate((el) => {
        const style = getComputedStyle(el);
        return { size: parseFloat(style.fontSize), spacing: parseFloat(style.letterSpacing) };
      });
      expect(size).toBe(16);
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

Then(
  "every Panel title is centred across its Panel, a tenth of its width above the middle",
  async function (this: PortfolioWorld) {
    // By design (as in the pen): the Panel's bottom padding, 20% of its width, lifts the title.
    for (const item of await panels(this).all()) {
      const outer = (await item.boundingBox())!;
      const inner = (await item.getByRole("link").boundingBox())!;
      expect(Math.abs(inner.x + inner.width / 2 - (outer.x + outer.width / 2))).toBeLessThan(2);
      const lift = outer.y + outer.height / 2 - (inner.y + inner.height / 2);
      expect(Math.abs(lift - outer.width / 10)).toBeLessThan(2);
    }
  },
);

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

/** The dots row above the title: the `::before` of the title's container, a grid row of its own. */
const dots = (link: Locator) =>
  link.evaluate((el) => {
    const content = el.parentElement as HTMLElement;
    const style = getComputedStyle(content, "::before");
    const width = parseFloat(style.width);
    const box = content.getBoundingClientRect();
    return {
      above: style.content !== "none",
      opacity: parseFloat(style.opacity),
      width,
      height: parseFloat(style.height),
      // A pseudo-element has no box to measure. The row is centred in the container, which spans
      // the Panel.
      left: box.left + (box.width - width) / 2,
      justifyItems: getComputedStyle(content).justifyItems,
      transform: style.transform,
      alignSelf: style.alignSelf,
      gap: parseFloat(style.marginBottom),
      positionX: style.backgroundPositionX,
      animated: style.animationName !== "none",
    };
  });

Then(
  "the dots above the Panel title {string} are hidden",
  async function (this: PortfolioWorld, name: string) {
    await expect.poll(async () => (await dots(title(this, name))).opacity).toBe(0);
  },
);

Then(
  "the dots above the Panel title {string} are shown",
  async function (this: PortfolioWorld, name: string) {
    await expect.poll(async () => (await dots(title(this, name))).opacity).toBe(1);
  },
);

Then(
  "the dots above the Panel title {string} span the Panel, inset by 2% each side, and are at most {int}px tall",
  async function (this: PortfolioWorld, name: string, max: number) {
    const row = await dots(title(this, name));
    const box = (await panel(this, name).boundingBox())!;
    expect(row.above).toBe(true);
    close(row.width, box.width * 0.96);
    // The Panel's left edge plus its 2% inset. Slid in: no transform left.
    expect(row.justifyItems).toBe("center");
    close(row.left, box.x + box.width * 0.02);
    expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(row.transform);
    expect(row.height).toBeGreaterThan(0);
    expect(row.height).toBeLessThanOrEqual(max);
  },
);

/** A token's value in px: what `var(--token)` resolves to as a length. */
const tokenPx = (world: PortfolioWorld, token: string) =>
  world.page.evaluate((name) => {
    const probe = document.createElement("div");
    probe.style.marginTop = `var(${name})`;
    document.body.append(probe);
    const px = parseFloat(getComputedStyle(probe).marginTop);
    probe.remove();
    return px;
  }, token);

Then(
  "the dots above the Panel title {string} end above the title at the top label gap",
  async function (this: PortfolioWorld, name: string) {
    const row = await dots(title(this, name));
    // The row above the title ends at the title's top edge, and the dots sit at its end, lifted by
    // the gap: they never reach the title.
    expect(row.above).toBe(true);
    expect(row.alignSelf).toBe("end");
    expect(row.gap).toBeGreaterThan(0);
    close(row.gap, await tokenPx(this, "--label-gap-top"));
  },
);

Then(
  "the Sublabel under {string} hangs at the bottom label gap",
  async function (this: PortfolioWorld, name: string) {
    const gap = await panel(this, name)
      .locator("p")
      .evaluate((el) => parseFloat(getComputedStyle(el).marginTop));
    close(gap, await tokenPx(this, "--label-gap-bottom"));
  },
);

Then(
  "there are no dots by the Panel title {string}",
  async function (this: PortfolioWorld, name: string) {
    // Neither above the title (its container's `::before`) nor beside it (its own).
    const contents = await title(this, name).evaluate((el) => [
      getComputedStyle(el.parentElement!, "::before").content,
      getComputedStyle(el, "::before").content,
    ]);
    expect(contents).toEqual(["none", "none"]);
  },
);

Then(
  "the dots above the Panel title {string} are moving",
  async function (this: PortfolioWorld, name: string) {
    const before = await dots(title(this, name));
    expect(before.animated).toBe(true);
    await expect
      .poll(async () => (await dots(title(this, name))).positionX)
      .not.toBe(before.positionX);
  },
);

/** Whether an entrance animation plays. The Panels' endless dot drift is not one. */
const animating = (world: PortfolioWorld) =>
  world.page.evaluate(() =>
    document
      .getAnimations()
      .some(
        (a) => a.playState === "running" && a.effect?.getComputedTiming().iterations !== Infinity,
      ),
  );

/** What fades a title in is the wrapper around it and its Sublabel. */
const titleOpacities = (world: PortfolioWorld) =>
  world.page
    .getByRole("link")
    .evaluateAll((links) =>
      links.map((el) => parseFloat(getComputedStyle(el.parentElement!).opacity)),
    );

/**
 * The Panels' 3D unfold reaches past the window while it plays. If the page could scroll then, a
 * scrollbar would appear and vanish, and the whole Board would jump by its width.
 */
Given("I watch the page size", async function (this: PortfolioWorld) {
  await this.page.evaluate(() => {
    const watch = window as unknown as { overflow: number };
    watch.overflow = 0;
    const tick = () => {
      const page = document.documentElement;
      watch.overflow = Math.max(
        watch.overflow,
        page.scrollHeight - page.clientHeight,
        page.scrollWidth - page.clientWidth,
      );
      requestAnimationFrame(tick);
    };
    tick();
  });
});

Then("the page never grew beyond the window", async function (this: PortfolioWorld) {
  expect(await this.page.evaluate(() => (window as unknown as { overflow: number }).overflow)).toBe(
    0,
  );
});

Given("the visitor prefers reduced motion", async function (this: PortfolioWorld) {
  await this.page.emulateMedia({ reducedMotion: "reduce" });
});

Given("the visitor accepts motion", async function (this: PortfolioWorld) {
  await this.page.emulateMedia({ reducedMotion: "no-preference" });
});

Then("the Board is unfolding", async function (this: PortfolioWorld) {
  await expect.poll(() => animating(this)).toBe(true);
});

Then("the Board is not unfolding", async function (this: PortfolioWorld) {
  await expect(this.page.getByRole("main")).toBeVisible();
  expect(await animating(this)).toBe(false);
});

Then("the Panel titles are hidden while the Panels unfold", async function (this: PortfolioWorld) {
  expect(await titleOpacities(this)).toEqual([0, 0, 0, 0, 0]);
});

When("the unfold has ended", async function (this: PortfolioWorld) {
  // The route renders the Board after the page's `load`: before that no entrance plays yet.
  await expect(this.page.getByRole("main")).toBeVisible();
  // The whole entrance takes about 1.6s.
  await expect.poll(() => animating(this), { timeout: 5000 }).toBe(false);
});

Then("every Panel and title is fully shown", async function (this: PortfolioWorld) {
  expect(await titleOpacities(this)).toEqual([1, 1, 1, 1, 1]);
  for (const item of await panels(this).all()) {
    await expect(item).toHaveCSS("opacity", "1");
    await expect(item).toHaveCSS("transform", "none");
  }
});

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
