import { Given, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { Locator } from "@playwright/test";
import type { PortfolioWorld, RecordedTransition } from "../support/world.ts";

/** The page-side log the recorder fills, one entry per View Transition, once it is ready. */
type TransitionLog = { transitions: RecordedTransition[] };

/**
 * Wraps `document.startViewTransition` before the app loads, and records each transition the
 * router starts: its types and, once its pseudo-elements exist, every animation on them, with the
 * opacity of the old snapshots.
 */
Given("I record the View Transitions", async function (this: PortfolioWorld) {
  await this.page.addInitScript(() => {
    const log: TransitionLog = { transitions: [] };
    (window as unknown as { viewTransitions: TransitionLog }).viewTransitions = log;
    const start = document.startViewTransition.bind(document);
    document.startViewTransition = ((options: StartViewTransitionOptions) => {
      const transition = start(options);
      // One entry per transition, in the order they start: filled once its pseudo-elements exist,
      // or with why the browser skipped it.
      const entry: RecordedTransition = {
        types: [...transition.types],
        animations: [],
        oldOpacities: [],
      };
      log.transitions.push(entry);
      const record = () => {
        const root = document.documentElement;
        entry.animations = document
          .getAnimations()
          .filter((animation) =>
            (animation.effect as KeyframeEffect | null)?.pseudoElement?.startsWith(
              "::view-transition",
            ),
          )
          .map((animation) => {
            const effect = animation.effect as KeyframeEffect;
            const pseudo = effect.pseudoElement!;
            const timing = effect.getComputedTiming();
            return {
              pseudo,
              duration: Number(timing.duration),
              delay: timing.delay ?? 0,
              easing: getComputedStyle(root, pseudo).animationTimingFunction,
            };
          });
        entry.oldOpacities = [...document.querySelectorAll("li > *")]
          .map((view) => [getComputedStyle(view.parentElement!), getComputedStyle(view)])
          .flat()
          .map((style) => style.viewTransitionName)
          .filter((name) => name !== "none")
          .map((name) =>
            parseFloat(getComputedStyle(root, `::view-transition-old(${name})`).opacity),
          );
      };
      transition.ready.then(
        () => {
          try {
            record();
          } catch (error) {
            entry.failed = String(error);
          }
          entry.ready = true;
        },
        (error: unknown) => {
          entry.skipped = String(error);
          entry.ready = true;
        },
      );
      return transition;
    }) as typeof document.startViewTransition;
  });
});

const recorded = (world: PortfolioWorld) =>
  world.page.evaluate(
    () => (window as unknown as { viewTransitions: TransitionLog }).viewTransitions.transitions,
  );

/** The View Transition the last "plays" step took: the steps after it check this one. */
const current = (world: PortfolioWorld): RecordedTransition => {
  if (!world.transition) throw new Error("No View Transition has been checked to play yet");
  return world.transition;
};

const groups = (transition: RecordedTransition) =>
  transition.animations.filter(({ pseudo }) =>
    /^::view-transition-group\((slot|view)-/.test(pseudo),
  );

const fadesIn = (transition: RecordedTransition) =>
  transition.animations.filter(({ pseudo }) => pseudo.startsWith("::view-transition-new("));

/** The `view-transition-name` of the view in each slot `items` points into. */
const viewNames = (items: Locator) =>
  items.evaluateAll((elements) =>
    elements.map((el) => getComputedStyle(el.closest("li")!.firstElementChild!).viewTransitionName),
  );

const expectFades = async (
  world: PortfolioWorld,
  items: Locator,
  duration: number,
  delay: number,
) => {
  const fades = fadesIn(current(world));
  const names = await viewNames(items);
  expect(names.length).toBeGreaterThan(0);
  for (const name of names)
    expect(fades.find(({ pseudo }) => pseudo === `::view-transition-new(${name})`)).toMatchObject({
      duration,
      delay,
    });
};

Then(
  "a View Transition of type {string} plays",
  async function (this: PortfolioWorld, type: string) {
    await expect
      .poll(async () => (await recorded(this))[this.transitionsSeen]?.ready ?? false)
      .toBe(true);
    const transition = (await recorded(this))[this.transitionsSeen]!;
    this.transition = transition;
    this.transitionsSeen += 1;
    expect(transition.skipped).toBeUndefined();
    expect(transition.failed).toBeUndefined();
    expect(transition.types).toEqual([type]);
  },
);

Then("no View Transition has played", async function (this: PortfolioWorld) {
  expect(await recorded(this)).toEqual([]);
});

Then(
  "every slot and view resizes over {int}ms, {string}",
  function (this: PortfolioWorld, duration: number, easing: string) {
    const resizes = groups(current(this));
    // Five slots and their five views.
    expect(resizes).toHaveLength(10);
    for (const resize of resizes) expect(resize).toMatchObject({ duration, delay: 0, easing });
  },
);

Then("no old view is shown", function (this: PortfolioWorld) {
  const { oldOpacities } = current(this);
  expect(oldOpacities.length).toBeGreaterThan(0);
  expect(oldOpacities.every((opacity) => opacity === 0)).toBe(true);
});

Then("no view fades in", function (this: PortfolioWorld) {
  expect(fadesIn(current(this))).toEqual([]);
});

Then("nothing animates in it", function (this: PortfolioWorld) {
  expect(current(this).animations).toEqual([]);
});

Then(
  "the Stripes fade in over {int}ms after {int}ms",
  async function (this: PortfolioWorld, duration: number, delay: number) {
    // The Stripes: the links in every slot but the Expanded panel's.
    const stripes = this.page
      .getByRole("listitem")
      .filter({ hasNot: this.page.getByRole("heading") })
      .getByRole("link");
    await expectFades(this, stripes, duration, delay);
  },
);

Then(
  "the Expanded panel {string} fades in over {int}ms after {int}ms",
  async function (this: PortfolioWorld, name: string, duration: number, delay: number) {
    await expectFades(this, this.page.getByRole("heading", { name, exact: true }), duration, delay);
  },
);

Then(
  "every Panel fades in over {int}ms after {int}ms",
  async function (this: PortfolioWorld, duration: number, delay: number) {
    await expectFades(this, this.page.getByRole("listitem"), duration, delay);
  },
);
