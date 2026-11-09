import { render, screen } from "@octanejs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./App.tsrx";

describe("App", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("renders the Landing with the English messages", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>(() => new Promise(() => {})),
    );
    render(App, { props: {} });
    expect(screen.getByRole("button", { name: "Portfolio A.Durnev" })).toBeInTheDocument();
  });
});
