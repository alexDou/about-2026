import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  setDefaultTimeout,
  setWorldConstructor,
  World,
} from "@cucumber/cucumber";
import { chromium } from "@playwright/test";
import type { Browser, BrowserContext, Page } from "@playwright/test";
import { startStaticServer } from "./static-server.ts";
import type { StaticServer } from "./static-server.ts";

setDefaultTimeout(30_000);

let server: StaticServer;
let browser: Browser;
let baseUrl: string;

export class PortfolioWorld extends World {
  context!: BrowserContext;
  page!: Page;
  fetchedText = "";

  url(path = "/"): string {
    return new URL(path, baseUrl).href;
  }
}

setWorldConstructor(PortfolioWorld);

// Serves the production build (`rspack build` runs first via `pnpm e2e`).
BeforeAll(async function () {
  server = await startStaticServer();
  baseUrl = server.url;
  browser = await chromium.launch();
});

AfterAll(async function () {
  await browser?.close();
  await server?.close();
});

Before(async function (this: PortfolioWorld) {
  // The Board unfolds on every mount, so measuring scenarios would catch the Panels mid-flight.
  // Reduced motion shows the end state at once; scenarios about the unfold accept motion.
  this.context = await browser.newContext({ reducedMotion: "reduce" });
  this.page = await this.context.newPage();
});

After(async function (this: PortfolioWorld) {
  await this.context?.close();
});
