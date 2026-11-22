import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { PortfolioWorld } from "../support/world.ts";

const TRANSPARENT = "rgba(0, 0, 0, 0)";
const ABOUT_TEXT = "rgb(37, 54, 58)";

const band = (world: PortfolioWorld) => world.page.locator("main section > div").first();

/** The Contact items by their name in the scenario. */
const item = (world: PortfolioWorld, name: string) => {
  const items = {
    remote: band(world).getByText("Remote, worldwide"),
    links: band(world).getByRole("list"),
    form: band(world).locator("fieldset"),
    notice: band(world).getByText("I use these details only"),
    submit: band(world).getByRole("button", { name: "Send" }),
    required: band(world).getByText("* required"),
    info: band(world).locator("> div").first(),
  } as const;
  return items[name as keyof typeof items];
};

const box = async (world: PortfolioWorld, name: string) => {
  const found = await item(world, name).boundingBox();
  if (!found) throw new Error(`The ${name} is not on screen`);
  return found;
};

Then(
  "the Contact page has no band and its text is in the About colour",
  async function (this: PortfolioWorld) {
    await expect(band(this)).toHaveCSS("background-color", TRANSPARENT);
    await expect(item(this, "remote")).toHaveCSS("color", ABOUT_TEXT);
  },
);

Then("the Contact band says {string}", async function (this: PortfolioWorld, text: string) {
  await expect(band(this)).toContainText(text);
});

Then(
  "the Contact profile links are {string}",
  async function (this: PortfolioWorld, names: string) {
    const links = band(this).getByRole("list").getByRole("link");
    await expect(links).toHaveCount(names.split(", ").length);
    expect(await links.evaluateAll((all) => all.map((a) => a.getAttribute("aria-label")))).toEqual(
      names.split(", "),
    );
  },
);

Then("the Contact form stands left of the other items", async function (this: PortfolioWorld) {
  const form = await box(this, "form");
  for (const name of ["remote", "links", "notice"]) {
    const right = await box(this, name);
    expect(form.x + form.width).toBeLessThanOrEqual(right.x + 1);
  }
});

Then(
  "the Contact info block is centred against the form's inputs",
  async function (this: PortfolioWorld) {
    // The fields' block is as tall as the inputs with the hint under the last one; it has a row of its own.
    const info = await box(this, "info");
    const fields = await box(this, "form");
    expect(info.y + info.height / 2).toBeCloseTo(fields.y + fields.height / 2, 0);
  },
);

Then("the Contact info block stands under the form", async function (this: PortfolioWorld) {
  const info = await box(this, "info");
  const submit = await box(this, "submit");
  expect(submit.y + submit.height).toBeLessThanOrEqual(info.y + 1);
});

Then("the Contact info shows {int} rules", async function (this: PortfolioWorld, count: number) {
  const rules = band(this).getByRole("separator");
  await expect(rules).toHaveCount(count);
});

const stack = async (world: PortfolioWorld, order: string) => {
  const names = order.split(", ");
  const boxes = await Promise.all(names.map((name) => box(world, name)));
  for (const [i, current] of boxes.entries()) {
    const next = boxes[i + 1];
    if (next) expect(current.y + current.height).toBeLessThanOrEqual(next.y + 1);
  }
};

Then(
  "the Contact items stack down the page in the order {string}",
  async function (this: PortfolioWorld, order: string) {
    await stack(this, order);
  },
);

/** Every label of the form with the input it names. */
const labelled = async (world: PortfolioWorld) => {
  const labels = world.page.locator("form label:visible");
  await labels.first().waitFor();
  const count = await labels.count();
  expect(count).toBeGreaterThan(0);
  return Promise.all(
    Array.from({ length: count }, async (_, i) => {
      const label = labels.nth(i);
      const input = world.page.locator(`[id="${await label.getAttribute("for")}"]`);
      const [labelBox, inputBox] = await Promise.all([label.boundingBox(), input.boundingBox()]);
      if (!labelBox || !inputBox) throw new Error("A label or its input is not on screen");
      return { labelBox, inputBox };
    }),
  );
};

Then("every Contact label stands beside its input", async function (this: PortfolioWorld) {
  for (const { labelBox, inputBox } of await labelled(this)) {
    expect(labelBox.x + labelBox.width).toBeLessThanOrEqual(inputBox.x + 1);
    expect(labelBox.y).toBeLessThan(inputBox.y + inputBox.height);
    expect(labelBox.y + labelBox.height).toBeGreaterThan(inputBox.y);
  }
});

Then("every Contact label stands above its input", async function (this: PortfolioWorld) {
  for (const { labelBox, inputBox } of await labelled(this)) {
    expect(labelBox.y + labelBox.height).toBeLessThanOrEqual(inputBox.y + 1);
  }
});

Then(
  "the Send button stands under the inputs, as wide as they are",
  async function (this: PortfolioWorld) {
    const inputs = this.page.locator("form input[type=text]:visible");
    const last = await inputs.last().boundingBox();
    const submit = await box(this, "submit");
    if (!last) throw new Error("The last input is not on screen");
    expect(submit.y).toBeGreaterThanOrEqual(last.y + last.height - 1);
    expect(submit.x).toBeCloseTo(last.x, 0);
    expect(submit.width).toBeCloseTo(last.width, 0);
  },
);

Then("the page heading is in capitals", async function (this: PortfolioWorld) {
  await expect(this.page.getByRole("heading", { level: 1 })).toHaveCSS(
    "text-transform",
    "uppercase",
  );
});

/**
 * A challenge along the contract (`ChallengeResponse`): one the real widget can solve in the
 * browser, as the backend does not sign it here.
 */
const CHALLENGE = {
  parameters: {
    algorithm: "PBKDF2/SHA-256",
    cost: 1,
    keyLength: 32,
    keyPrefix: "00",
    nonce: "00112233445566778899aabbccddeeff",
    salt: "ffeeddccbbaa99887766554433221100",
    expiresAt: 4_102_444_800,
  },
  signature: "e2e-stub-signature",
};

/** Stubs `GET /api/contact/challenge`, which the widget fetches when the form is submitted. */
const stubChallenge = (world: PortfolioWorld) =>
  world.page.route("**/api/contact/challenge", async (route) => {
    await route.fulfill({ json: CHALLENGE });
  });

Given("the backend accepts Contact requests", async function (this: PortfolioWorld) {
  await stubChallenge(this);
  // Registered after the health stub, so it answers first for this path.
  await this.page.route("**/api/contact", async (route) => {
    this.contactRequests.push(route.request().postDataJSON());
    await route.fulfill({ status: 204 });
  });
});

Given(
  "the backend refuses Contact requests with {int}",
  async function (this: PortfolioWorld, status: number) {
    await stubChallenge(this);
    await this.page.route("**/api/contact", async (route) => {
      this.contactRequests.push(route.request().postDataJSON());
      await route.fulfill({ status, json: { detail: "refused" } });
    });
  },
);

Given(
  "the backend refuses Contact requests with 422 for {string} as {string}",
  async function (this: PortfolioWorld, field: string, error: string) {
    await stubChallenge(this);
    await this.page.route("**/api/contact", async (route) => {
      this.contactRequests.push(route.request().postDataJSON());
      await route.fulfill({
        status: 422,
        json: { detail: "Invalid fields", fields: [{ field, error }] },
      });
    });
  },
);

Given("the Contact challenge cannot be fetched", async function (this: PortfolioWorld) {
  await this.page.route("**/api/contact/challenge", async (route) => {
    await route.abort("connectionrefused");
  });
  await this.page.route("**/api/contact", async (route) => {
    this.contactRequests.push(route.request().postDataJSON());
    await route.fulfill({ status: 204 });
  });
});

Given("Contact requests cannot reach the backend", async function (this: PortfolioWorld) {
  await stubChallenge(this);
  await this.page.route("**/api/contact", async (route) => {
    this.contactRequests.push(route.request().postDataJSON());
    await route.abort("connectionrefused");
  });
});

When(
  "I fill in {string} with {string}",
  async function (this: PortfolioWorld, label: string, value: string) {
    await this.page.getByLabel(label).fill(value);
  },
);

When("I press {string}", async function (this: PortfolioWorld, name: string) {
  await this.page.getByRole("button", { name }).click();
});

Then("the Contact form says {string}", async function (this: PortfolioWorld, text: string) {
  await expect(this.page.getByRole("status").filter({ hasText: text })).toBeVisible();
});

Then("the form is gone", async function (this: PortfolioWorld) {
  await expect(this.page.getByRole("button", { name: "Send" })).toHaveCount(0);
});

Then(
  "the backend received a Contact request from {string} at {string}",
  async function (this: PortfolioWorld, name: string, company: string) {
    expect(this.contactRequests).toHaveLength(1);
    expect(this.contactRequests[0]).toMatchObject({ name, company });
  },
);

Then(
  "the Contact request carries a human check the widget solved",
  async function (this: PortfolioWorld) {
    expect(this.contactRequests).toHaveLength(1);
    const { altcha } = this.contactRequests[0] as { altcha: string };
    // The widget's payload: the challenge it was given and the solution it found.
    const payload = JSON.parse(Buffer.from(altcha, "base64").toString("utf8")) as {
      challenge: { parameters: unknown; signature: string };
      solution: { counter: number; derivedKey: string };
    };
    expect(payload.challenge).toEqual(CHALLENGE);
    expect(payload.solution.derivedKey.startsWith(CHALLENGE.parameters.keyPrefix)).toBe(true);
  },
);

Then("the Contact request leaves the honeypot out", async function (this: PortfolioWorld) {
  expect(Object.keys(this.contactRequests[0] as object)).not.toContain("website");
});

Then(
  "the Contact form has a field {string} that no Visitor can reach",
  async function (this: PortfolioWorld, name: string) {
    const field = this.page.locator(`form input[name="${name}"]`);
    await expect(field).toHaveCount(1);
    await expect(field).toBeHidden();
    await expect(field.locator("xpath=ancestor::*[@aria-hidden='true']")).toHaveCount(1);
  },
);

When(
  "a bot fills the field {string} behind the Visitor's back",
  async function (this: PortfolioWorld, name: string) {
    // A Visitor cannot type into a hidden field, a script can.
    await this.page.locator(`form input[name="${name}"]`).evaluate((input: HTMLInputElement) => {
      input.value = "https://spam.example";
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  },
);

Then(
  "the Contact request carries the honeypot {string}",
  async function (this: PortfolioWorld, value: string) {
    expect(this.contactRequests[0]).toMatchObject({ website: value });
  },
);

Then("the page says {string}", async function (this: PortfolioWorld, text: string) {
  await expect(this.page.getByText(text)).toBeVisible();
});

Then("the page does not say {string}", async function (this: PortfolioWorld, text: string) {
  await expect(this.page.getByText(text)).toBeHidden();
});

Then("the field {string} is in error", async function (this: PortfolioWorld, label: string) {
  await expect(this.page.getByLabel(label)).toHaveAttribute("aria-invalid", "true");
});

Then("the field {string} has focus", async function (this: PortfolioWorld, label: string) {
  await expect(this.page.getByLabel(label)).toBeFocused();
});

When("I leave the field {string}", async function (this: PortfolioWorld, label: string) {
  // Focused first, so that a field the Visitor never filled is entered and then left.
  const field = this.page.getByLabel(label);
  await field.focus();
  await field.blur();
});

Then(
  "the field {string} holds {string}",
  async function (this: PortfolioWorld, label: string, value: string) {
    await expect(this.page.getByLabel(label)).toHaveValue(value);
  },
);

Then("the backend received no Contact request", async function (this: PortfolioWorld) {
  expect(this.contactRequests).toHaveLength(0);
});

Then(
  "the failure notice counts down from {int} s",
  async function (this: PortfolioWorld, from: number) {
    // Only the first sentence is the alert, so the seconds are not read out as they change.
    await expect(this.page.getByRole("alert")).toHaveText("Your request wasn't sent.");
    const countdown = this.page.getByText(/^Please try again in \d+ s\.$/);
    await expect(countdown).toBeVisible();
    const seconds = Number(/in (\d+) s/.exec((await countdown.textContent()) ?? "")?.[1]);
    expect(seconds).toBeLessThanOrEqual(from);
    expect(seconds).toBeGreaterThan(0);
  },
);

Then("the Send button is disabled", async function (this: PortfolioWorld) {
  await expect(this.page.getByRole("button", { name: "Send" })).toBeDisabled();
});

Then("the Send button is enabled", async function (this: PortfolioWorld) {
  await expect(this.page.getByRole("button", { name: "Send" })).toBeEnabled();
});

Then("no failure notice shows", async function (this: PortfolioWorld) {
  await expect(this.page.getByRole("alert")).toHaveCount(0);
  await expect(this.page.getByText(/Please try again/)).toHaveCount(0);
});

Then("the Contact form is disabled", async function (this: PortfolioWorld) {
  await expect(this.page.getByRole("button", { name: "Send" })).toBeDisabled();
  for (const input of await this.page.getByRole("textbox").all()) {
    await expect(input).toBeDisabled();
  }
});
