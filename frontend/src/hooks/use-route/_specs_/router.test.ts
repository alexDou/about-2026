import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { testRouter } from "..";

/** Starts a test at `path` as if the visitor had just loaded it. */
function visit(path: string) {
  window.history.replaceState(null, "", path);
}

describe("createAppRouter", () => {
  beforeEach(() => visit("/"));
  afterEach(() => visit("/"));

  it("turns the browser's scroll restoration off as soon as it exists, before any page renders", () => {
    window.history.scrollRestoration = "auto";
    testRouter();
    expect(window.history.scrollRestoration).toBe("manual");
  });

  it.each(["/nope", "/skills/extra", "/Skills", "/explore/about"])(
    "replaces the unknown path %s by / without a history entry",
    async (path) => {
      visit(path);
      const entries = window.history.length;
      await testRouter().load();
      expect(window.location.pathname).toBe("/");
      expect(window.history.length).toBe(entries);
    },
  );

  it.each([
    ["/explore/", "/explore"],
    ["/what-i-do//", "/what-i-do"],
    ["/explore/?a=1#b", "/explore?a=1#b"],
  ])("replaces %s by %s without a history entry", async (path, canonical) => {
    visit(path);
    const entries = window.history.length;
    await testRouter().load();
    expect(window.location.pathname + window.location.search + window.location.hash).toBe(
      canonical,
    );
    expect(window.history.length).toBe(entries);
  });
});
