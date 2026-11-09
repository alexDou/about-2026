import { describe, expect, it } from "vitest";
import { PANEL_IDS, pathOf, resolvePath, type Route } from "..";

/** Every state the site can be in, with its URL (the spec's table). */
const ROUTES: ReadonlyArray<{ route: Route; path: string }> = [
  { route: { screen: "landing" }, path: "/" },
  { route: { screen: "board", board: { kind: "default" } }, path: "/explore" },
  { route: { screen: "board", board: { kind: "expanded", panel: "about" } }, path: "/about" },
  { route: { screen: "board", board: { kind: "expanded", panel: "whatIDo" } }, path: "/what-i-do" },
  { route: { screen: "board", board: { kind: "expanded", panel: "skills" } }, path: "/skills" },
  { route: { screen: "board", board: { kind: "expanded", panel: "chatWithMe" } }, path: "/chat" },
  { route: { screen: "board", board: { kind: "expanded", panel: "contact" } }, path: "/contact" },
];

describe("PANEL_IDS", () => {
  it("lists the five Panels in Board order", () => {
    expect(PANEL_IDS).toEqual(["about", "whatIDo", "skills", "chatWithMe", "contact"]);
  });
});

describe("pathOf", () => {
  it.each(ROUTES)("gives $path for its state", ({ route, path }) => {
    expect(pathOf(route)).toBe(path);
  });
});

describe("resolvePath", () => {
  it.each(ROUTES)("reads $path back as the state it came from", ({ route, path }) => {
    expect(resolvePath(path)).toEqual({ route, path, replace: false });
  });

  it.each(ROUTES)("round-trips the state behind $path", ({ route }) => {
    expect(resolvePath(pathOf(route)).route).toEqual(route);
  });

  it.each<{ requested: string; route: Route; path: string }>([
    {
      requested: "/skills/",
      route: { screen: "board", board: { kind: "expanded", panel: "skills" } },
      path: "/skills",
    },
    {
      requested: "/explore/",
      route: { screen: "board", board: { kind: "default" } },
      path: "/explore",
    },
    {
      requested: "/what-i-do//",
      route: { screen: "board", board: { kind: "expanded", panel: "whatIDo" } },
      path: "/what-i-do",
    },
  ])("drops the trailing slash of $requested", ({ requested, route, path }) => {
    expect(resolvePath(requested)).toEqual({ route, path, replace: true });
  });

  it.each(["/nope", "/skills/extra", "/Skills", "/explore/about", ""])(
    "replaces the unknown path %j by the Landing",
    (requested) => {
      expect(resolvePath(requested)).toEqual({
        route: { screen: "landing" },
        path: "/",
        replace: true,
      });
    },
  );
});
