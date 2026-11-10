import { renderHook } from "@octanejs/testing-library";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useDocumentTitle } from "..";

describe("useDocumentTitle", () => {
  beforeEach(() => {
    document.head.innerHTML = "<title>Static title</title>";
  });
  afterEach(() => {
    document.head.innerHTML = "";
  });

  it("sets the document title while mounted", () => {
    renderHook(() => useDocumentTitle("Skills"));
    expect(document.title).toBe("Skills");
  });

  it("follows the title it is given", () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: "Skills" },
    });
    rerender({ title: "Contact" });
    expect(document.title).toBe("Contact");
  });

  it("gives the static title back on unmount", () => {
    const { unmount } = renderHook(() => useDocumentTitle("Skills"));
    unmount();
    expect(document.title).toBe("Static title");
  });
});
