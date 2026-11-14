import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { RemoteWorkBadge } from ".././RemoteWorkBadge.tsrx";

describe("RemoteWorkBadge", () => {
  it("names the badge by its whole text and titles it", () => {
    render(RemoteWorkBadge, {
      props: { text: "ARBEIT / BEREIT", title: "Remote zuerst." },
    });
    expect(screen.getByRole("img", { name: "ARBEIT / BEREIT" })).toBeInTheDocument();
    expect(screen.getByTitle("Remote zuerst.")).toBeInTheDocument();
  });

  it("sets the part before the slash on the top arc and the part after it on the bottom arc", () => {
    const { container } = render(RemoteWorkBadge, {
      props: { text: "REMOTE WORK / READY", title: "x" },
    });
    for (const part of ["REMOTE WORK", "READY"]) {
      const run = screen.getByText(part);
      expect(run.tagName).toBe("textPath");
      const target = run.getAttribute("href")?.slice(1) ?? "";
      expect(container.querySelector(`[id="${target}"]`)).not.toBeNull();
    }
    expect(screen.getByText("REMOTE WORK").getAttribute("href")).not.toBe(
      screen.getByText("READY").getAttribute("href"),
    );
  });
});
