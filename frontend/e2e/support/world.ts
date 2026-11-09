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
  consoleMessages: string[] = [];
  /** Console errors and uncaught exceptions, in order. */
  pageErrors: string[] = [];

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
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  this.page.on("console", (message) => {
    this.consoleMessages.push(message.text());
    if (message.type() === "error") this.pageErrors.push(message.text());
  });
  this.page.on("pageerror", (error) => this.pageErrors.push(error.message));
});

After(async function (this: PortfolioWorld) {
  await this.context?.close();
});
